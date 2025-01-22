import styles from "./Post.module.css"
import { useParams, useOutletContext } from "react-router";
import { useState, useEffect } from "react";
import Form from "../Form/Form";
import PropTypes from "prop-types";
export default function Post () {
    const { postId } = useParams();
    const {user} = useOutletContext();
    const [isFetched, setFetched] = useState(false)
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState("");
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
                throw new Error(response.message || 'Something went wrong');
            }
            setFetched(() => {
                setError("");
                setComment("");
                return false;
            })
        } catch(err) {
            setError(err.message)
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
    if (error) {
        return <div>Post doesn&apos;t exist</div>
    }
    if (!post) {
        return <div>Loading post...</div>
    }
    return (
        <>
            <section className={styles.container}>
                <img src={post.cover_url} alt={post.title} />
                <h2>{post.title}</h2>
                <p>{post.author.username}</p>
                <p>{post.creationDate}</p>
            </section>
            <section className={styles.comments}>
                {post.comments.map((comment) => <Comment key={comment.id} comment={comment}/>)}
            </section>
            { user ? <Form>
                <form action="" method="post" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="comment">Comment:</label>
                        <textarea id="comment" value={comment} onChange={handleInput}></textarea>
                    </div>
                    <button>Submit</button>
                </form>
            </Form> : <div>Login to comment</div> }
        </>
    )
}


function Comment ({ comment }) {
    return (
        <div>
            <h4>{comment.author.username}</h4>
            <h4>{comment.content}</h4>
        </div>
    )
}



Comment.propTypes = {
    comment: PropTypes.object.isRequired
}