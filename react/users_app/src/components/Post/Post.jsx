import styles from "./Post.module.css"
import { useParams, useOutletContext, Link } from "react-router";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { LoaderCircle, CircleUser, Trash } from 'lucide-react';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
const API_URL = import.meta.env.VITE_API_URL;
export default function Post () {
    const { postId } = useParams();
    const {user} = useOutletContext();
    const [isFetched, setFetched] = useState(false)
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState("");
    const [success, setSuccess] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false)
    const [actionLoading, setActionLoading] = useState(false);
    const handleInput = (e) => setComment(e.target.value)
    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            setActionLoading(true);
            const token = localStorage.getItem("cred");
            const request = await fetch(`${API_URL}/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                mode: "cors",
                body: JSON.stringify({
                    content: comment
                })
            })
            const response = await request.json();
            if (!request.ok) {
                const error = new Error('Invalid Request');
                error.messages = response.errors || [error.message];
                throw error;
            }
            setFetched(false)
            setError("");
            setComment("");
            setSuccess(true);
            setActionLoading(false);
            setTimeout(() => {
                setSuccess(false);;
            }, 8000)
        } catch(err) {
            setSuccess(false)
            setError(err.messages)
            setActionLoading(false);
            setTimeout(() => {
                setError("");;
            }, 8000)
        }
    }
    const handleCommentDelete = async (commentId) => {
        try {
            setActionLoading(true);
            const token = localStorage.getItem("cred");
            const request = await fetch(`${API_URL}/posts/${postId}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                mode: "cors",
            })
            if (!request.ok) {
                const error = new Error('Unexpected Error, please try again later');
                throw error;
            }
            setFetched(false);
            setDeleteError("");
            setDeleteSuccess(true);
            setActionLoading(false);
            setTimeout(() => {
                setDeleteSuccess(false);;
            }, 8000)
        } catch(err) {
            setDeleteError(err.message);
            setTimeout(() => {
                setDeleteError("");
            }, 8000)
            setDeleteSuccess(false);
            setActionLoading(false);
        }
    }
    useEffect(() => {
        let ignore = false;
        if(!isFetched) {
            setLoading(true);
            const fetchPosts = async () => {
                try {
                    const request = await fetch(`${API_URL}/posts/${postId}`,
                    {
                        method: "GET",
                        mode: "cors",
                    });
                    const response = await request.json();
                    if (!request.ok) {
                        throw new Error(response.message || 'Something went wrong');
                    }
                    if(!ignore) {
                        setPost(response.post)
                        setFetched(true);
                        setLoading(false)
                    }
                } catch (err) {
                    if(!ignore) {
                        setError(err);
                        setLoading(false)
                    }
                }
            };
            fetchPosts();
        }
        return () => {
            ignore = true;
        };
    }, [postId, isFetched]);
    if (error && !Array.isArray(error)) {
        return (
        <div className={styles.exist}>
            <h1>Post doesn&apos;t exist</h1>
            <Link to="/"><h1>Go back</h1></Link>
        </div>
    )
    }
    if (!post) {
        return(
        loading ? 
            <div className={styles.loading}>
                <LoaderCircle size={60} className={styles.icon}/>
                <p>This may take a while</p>
            </div> :
            <div className={styles.loading}>
                <h1>Post doesn&apos;t exist</h1>
                <Link to="/"><h1>Go back</h1></Link>
            </div>
        )
    }
    const cleanContent = DOMPurify.sanitize(post.content);
    return (
        <div className={styles.container}>
            <section className={styles.blog}>
                <h1>{post.title}</h1>
                <p className={styles.info}>Written by <em>{post.author.username}</em> on {post.creationDate}</p>
                {post.cover_url && <img src={post.cover_url} alt={post.title} />}
                <div className={styles.content}>
                    {parse(cleanContent)}
                </div>
            </section>
            <section className={styles.comments}>
                <h1>Comments</h1>
                <section className={styles.form}>
                { user ? 
                    <form action="" method="post" onSubmit={handleSubmit}>
                    { error && error.map((error, index) => <li key={index}>{error}</li>) }
                    { success && <li className={styles.success}>Comment posted</li> }
                        <div>
                            <label htmlFor="comment" hidden>Comment:</label>
                            <textarea id="comment" value={comment} onChange={handleInput} placeholder="Leave a comment..." required minLength={3} maxLength={500}></textarea>
                        </div>
                        <button disabled={actionLoading}>{actionLoading ? 'Pending' : 'Post Comment'}</button>
                    </form>
                    : <h2><Link to='/login'>Login to comment</Link></h2> }
                </section>
                {deleteError && <h3 className={styles.error}>{deleteError}</h3>  }
                {deleteSuccess && <h3 className={styles.success}>Comment deleted </h3>  }
                {loading ? <div className={styles.loading}>
                <LoaderCircle size={60} className={styles.icon}/>
                <p>This may take a while</p>
                </div> :
                post.comments.length > 0 ? post.comments.map((comment) => <Comment key={comment.id} comment={comment} user={user} onClick={handleCommentDelete} pending={actionLoading}/>) : <h2>Be the first to comment on this post</h2>}
            </section>
        </div>
    )
}


function Comment ({ comment, user, onClick, pending}) {
    return (
        <div className={styles.comment}>
            <CircleUser size={45}/>
            <div>
                <h4><em>{comment.author.username}</em></h4>
                <p>{comment.content}</p>
            </div>
            {(user && user.username === comment.author.username) && <button disabled={pending} onClick={() => onClick(comment.id)}>
                {!pending ? <Trash size={28}  color="white"/> : <LoaderCircle size={35} color="white" className={styles.icon}/>} </button>}
        </div>
    )
}



Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    user: PropTypes.object,
    onClick: PropTypes.func.isRequired,
    pending: PropTypes.bool
}