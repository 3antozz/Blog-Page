import styles from "./Posts.module.css"
import { useOutletContext } from "react-router";
import { Link } from "react-router";
import PropTypes from "prop-types";
import { LoaderCircle } from 'lucide-react';

export default function Posts () {
    const { posts, loading, error } = useOutletContext();
    if (error) {
        return (
        <div className={styles.loading}>
            <h1>{error || "Unexpected Error occured, please try again later."}</h1>
        </div>
        )
    }
    if (loading){
        return (
            <div className={styles.loading}>
                <LoaderCircle size={60} className={styles.icon}/>
                <p>This may take a while</p>
            </div>
        )
    }
    if (posts.length === 0){
        return (
            <>
                <section className={styles.intro}>
                    <img width={626} height={351} src="/closeup-coding-html-programming-screen-laptop-development-web-developer_641010-43297.avif" alt="a laptop" />
                    <div>
                        <h1>Welcome to my Blog</h1>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi quia odit dolorem recusandae natus quae cumque iusto ab eligendi, blanditiis dolorum nulla, eveniet rerum corrupti fugiat exercitationem deserunt quam non.</p>
                    </div>
                </section>
                <h1 className={styles.blog}>Blog Posts</h1>
                <section className={styles.posts}>
                    <h2>There are currently no posts!</h2>
                </section>
            </>
        )
    }
    return (
        <>
            <section className={styles.intro}>
                <img width={626} height={351} src="/closeup-coding-html-programming-screen-laptop-development-web-developer_641010-43297.avif" alt="a laptop" />
                <div>
                    <h1>Welcome to my Blog</h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi quia odit dolorem recusandae natus quae cumque iusto ab eligendi, blanditiis dolorum nulla, eveniet rerum corrupti fugiat exercitationem deserunt quam non.</p>
                </div>
            </section>
            <h1 className={styles.blog}>Blog Posts</h1>
            <section className={styles.posts}>
                {posts.map((post) => <Post key={post.id} post={post}/>)}
            </section>
        </>
    )
}

function Post ({post}) {
    return (
        <article className={styles.post}>
            <div className={styles.container}>
                <img src={post.cover_url ? post.cover_url : "/istockphoto-1351443977-612x612.jpg"} alt="" />
                <h2>{post.title}</h2>
                <p>{post.creationDate} by <em>{post.author.username}</em></p>
                <Link to={`/posts/${post.id}`}>Read Blog</Link>
            </div>
        </article>
    )
}


Post.propTypes = {
    post: PropTypes.object.isRequired
}


