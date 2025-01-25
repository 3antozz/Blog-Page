import styles from "./Post.module.css"
import { useParams, useOutletContext } from "react-router";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { LoaderCircle, CircleUser } from 'lucide-react';;
export default function Post () {
    const { postId } = useParams();
    const {user} = useOutletContext();
    const [isFetched, setFetched] = useState(false)
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState("");
    const [success, setSuccess] = useState(false)
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
            setFetched(() => {
                setError("");
                setComment("");
                setSuccess(true);
                return false;
            })
        } catch(err) {
            setSuccess(false);
            setError(err.messages)
            console.log(err);
        }
    }
    useEffect(() => {
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
                    setPost(() => {
                        setFetched(true);
                        return response.post
                    });
                    console.log(response);
                } catch (err) {
                    setError(err);
                    console.log(err)
                }
            };
            fetchPosts();
        }
    }, [postId, isFetched]);
    if (error && !Array.isArray(error)) {
        return <div>Post doesn&apos;t exist</div>
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
                    : <p>Login to comment</p> }
            </section>
            <section className={styles.comments}>
                <h1>Comments</h1>
                {post.comments.length > 0 ? post.comments.map((comment) => <Comment key={comment.id} comment={comment}/>) : <p>Be the first to comment on this post</p>}
            </section>
        </div>
    )
}


function Comment ({ comment }) {
    return (
        <div className={styles.comment}>
            <CircleUser size={45}/>
            <div>
                <h4><em>{comment.author.username}</em></h4>
                <p>{comment.content}</p>
            </div>
        </div>
    )
}



Comment.propTypes = {
    comment: PropTypes.object.isRequired
}