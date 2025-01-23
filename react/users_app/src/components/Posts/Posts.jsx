import styles from "./Posts.module.css"
import { useOutletContext } from "react-router";
import { Link } from "react-router";
import PropTypes from "prop-types";
export default function Posts () {
    const { posts } = useOutletContext();
    if (posts.length === 0) {
        return <div>Loading posts...</div>
    }
    return (
        <>
            {posts.map((post) => <Post key={post.id} post={post}/>)}
        </>
    )
}

function Post ({post}) {
    return (
        <Link to={`/posts/${post.id}`}>
            <section className={styles.container}>
                        <img src={post.cover_url} alt="" />
                        <h2>{post.title}</h2>
                    <p>{post.author.username}</p>
                    <p>{post.creationDate}</p>
            </section>
        </Link>
    )
}


Post.propTypes = {
    post: PropTypes.object.isRequired
}


