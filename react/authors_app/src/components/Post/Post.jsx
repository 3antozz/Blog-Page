import styles from "./Post.module.css"
import { useParams, useOutletContext, Link } from "react-router";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { LoaderCircle, CircleUser, Trash } from 'lucide-react';;
export default function Post () {
    const { postId } = useParams();
    const {user} = useOutletContext();
    const [isFetched, setFetched] = useState(false)
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState("");
    const [success, setSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [error, setError] = useState(null);
    const handleInput = (e) => setComment(e.target.value)
    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("cred");
            const request = await fetch(`http://localhost:3000/posts/${postId}/comments`, {
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
        } catch(err) {
            setSuccess(false)
            setError(err.messages)
            console.log(err);
        }
    }
    const handleCommentDelete = async (commentId) => {
        try {
            const token = localStorage.getItem("cred");
            const request = await fetch(`http://localhost:3000/posts/${postId}/comments/${commentId}`, {
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
            setFetched(false)
            setDeleteError("");
        } catch(err) {
            setDeleteError(err.message);
            setTimeout(() => {
                setDeleteError("");
            }, 8000)
            console.log(err);
        }
    }
    useEffect(() => {
        let ignore = false;
        if(!isFetched) {
            const fetchPosts = async () => {
                try {
                    const request = await fetch(`http://localhost:3000/posts/${postId}`,
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
                    }
                    console.log(response);
                } catch (err) {
                    if(!ignore) {
                        setError(err);
                    }
                    console.log(err)
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
            <div className={styles.loading}>
            <LoaderCircle size={60} className={styles.icon}/>
            <p>This may take a while</p>
        </div>
        )
    }
    return (
        <div className={styles.container}>
            <section className={styles.blog}>
                <h1>{post.title}</h1>
                <p className={styles.info}>Written by <em>{post.author.username}</em> on {post.creationDate}</p>
                <img src={post.cover_url} alt={post.title} />
                <p className={styles.content}>{post.content} Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit quam recusandae eius enim. Corporis obcaecati blanditiis distinctio soluta natus aperiam ullam ipsam dolor vitae in ex a saepe, impedit perferendis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis unde nisi officiis reiciendis exercitationem id maiores explicabo ut voluptate quos accusantium, rem quibusdam quasi in illo ex necessitatibus sequi blanditiis.</p>
            </section>
            <section className={styles.comments}>
                <h1>Comments</h1>
                <section className={styles.form}>
                { user ? 
                    <form action="" method="post" onSubmit={handleSubmit}>
                    { error && error.map((error, index) => <li key={index}>{error}</li>) }
                    { success && <li>Comment posted</li> }
                        <div>
                            <label htmlFor="comment" hidden>Comment:</label>
                            <textarea id="comment" value={comment} onChange={handleInput} placeholder="Leave a comment..."></textarea>
                        </div>
                        <button>Submit</button>
                    </form>
                    : <h2><Link to='/login'>Login to comment</Link></h2> }
                </section>
                {deleteError && <h3 className={styles.error}>{deleteError}</h3>  }
                {post.comments.length > 0 ? post.comments.map((comment) => <Comment key={comment.id} comment={comment} user={user} onClick={handleCommentDelete} deleteError={deleteError}/>) : <h2>Be the first to comment on this post</h2>}
            </section>
        </div>
    )
}


function Comment ({ comment, user, onClick}) {
    return (
        <div className={styles.comment}>
            <CircleUser size={45}/>
            <div>
                <h4><em>{comment.author.username}</em></h4>
                <p>{comment.content}</p>
            </div>
            {(user && user.username === comment.author.username) && <button onClick={() => onClick(comment.id)}><Trash size={28}  color="white"/></button>}
        </div>
    )
}



Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    user: PropTypes.object,
    onClick: PropTypes.func.isRequired,
}