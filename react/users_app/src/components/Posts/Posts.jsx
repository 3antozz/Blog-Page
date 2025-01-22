import styles from "./Posts.module.css"
// import { PostsContext } from "../../App"
// import { useContext } from "react"
import { useOutletContext } from "react-router";
import { Link } from "react-router";
import PropTypes from "prop-types";
export default function Posts () {
    // const { posts } = useContext(PostsContext);
    const { posts } = useOutletContext();
    return (
        <div>
            {posts.map((post) => <Post key={post.id} post={post}/>)}
        </div>
    )
}

function Post ({post}) {
    return (
        <Link to={`/posts/${post.id}`}>
            <section className={styles.container}>
                    <img src={post.cover_url} alt={post.title} />
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


