import styles from "./Post.module.css"
import { useParams, useOutletContext } from "react-router";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
export default function Post () {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const {isLoggedIn} = useOutletContext();
    useEffect(() => {
        const token = localStorage.getItem("cred");
        const headers = isLoggedIn
            ? {
                    method: "GET",
                    Authorization: `Bearer ${token}`,
                }
            : { method: "GET" };
        console.log(isLoggedIn);
        const fetchPosts = async () => {
            try {
                const request = await fetch(`http://localhost:3000/posts/${postId}`,
                {
                    headers: headers,
                    mode: "cors",
                });
                const response = await request.json();
                if (!request.ok) {
                    throw new Error(response.message || 'Something went wrong');
                }
                setPost(response.post);
                console.log(response);
            } catch (err) {
                console.log(err)
            }
        };
        fetchPosts();
    }, [postId, isLoggedIn]);
    if (!post) {
        return <div>Loading posts...</div>
    }
    return (
        <div>
            <section className={styles.container}>
                <img src={post.cover_url} alt={post.title} />
                <h2>{post.title}</h2>
                <p>{post.author.username}</p>
                <p>{post.creationDate}</p>
            </section>
            <section className={styles.comments}>
                {post.comments.map((comment) => <Comment key={comment.id} comment={comment}/>)}
            </section>
        </div>
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