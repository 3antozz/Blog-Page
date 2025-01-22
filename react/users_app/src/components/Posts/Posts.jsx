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
            <section className={styles.container}>
                    <Link to={`/posts/${post.id}`}>
                        <img src={post.cover_url} alt="" />
                        <h2>{post.title}</h2>
                    </Link>
                    <p>{post.author.username}</p>
                    <p>{post.creationDate}</p>
            </section>
    )
}


Post.propTypes = {
    post: PropTypes.object.isRequired
}


