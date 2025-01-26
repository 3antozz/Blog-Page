import styles from "./Posts.module.css"
import { useOutletContext } from "react-router";
import { Link } from "react-router";
import { useState } from "react";
import PropTypes from "prop-types";
import { LoaderCircle, Search } from 'lucide-react';
export default function Posts () {
    const { posts, error, user, publishPost } = useOutletContext();
    const [searchValue, setSearchValue] = useState("");
    const [publishError, setPublishError] = useState("")
    const handleSearch = (e) => setSearchValue(e.target.value)
    const switchPublishStatus = async (postId) => {
        try {
            const token = localStorage.getItem("cred");
            const request = await fetch(`http://localhost:3000/posts/${postId}/publish`, {
                method: 'PUT',
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
            publishPost(+postId)
            setPublishError("");
        } catch(err) {
            setPublishError(err.message);
            setTimeout(() => {
                setPublishError("");
            }, 8000)
            console.log(err);
        }
    }
    if(!user) {
        return (
            <div className={styles.loading}>
                <h1>Please Login first</h1>
            </div>
            )
    }
    if (error) {
        return (
        <div className={styles.loading}>
            <h1>{error || "Unexpected Error occured, please try again later."}</h1>
        </div>
        )
    }
    if (posts.length === 0) {
        return (
        <div className={styles.loading}>
            <LoaderCircle size={60} className={styles.icon}/>
            <p>This may take a while</p>
        </div>
        )
    }
    const filteredPosts = posts.filter((post) => {
        if(post.title.includes(searchValue) || post.content.includes(searchValue) || post.author.username.includes(searchValue)){
            return post;
        }
    })
    return (
        <>
            {publishError && <h3 className={styles.error}>{publishError}</h3>}
            <div className={styles.search}>
                <label htmlFor="search"></label>
                <input type="text" id="search" value={searchValue} onChange={handleSearch} placeholder="Search for posts..." />
                <Search className={styles.searchIcon} color="rgb(33, 33, 95)"/>
            </div>
            <h1 className={styles.blog}>Blog Posts</h1>
            <section className={styles.posts}>
                {(searchValue && filteredPosts.length === 0) && <h1>No post found</h1>}
                {searchValue ? filteredPosts.map((post) => <Post key={post.id} post={post} publish={switchPublishStatus}/>) : posts.map((post) => <Post key={post.id} post={post} publish={switchPublishStatus}/>) }
            </section>
        </>
    )
}

function Post ({post, publish}) {
    return (
        <section className={styles.post}>
            <section className={styles.container}>
                <img src={post.cover_url ? post.cover_url : "/istockphoto-1351443977-612x612.jpg"} alt="" />
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
                <p>{post.creationDate} by <em>{post.author.username}</em></p>
                <button onClick={() => publish(post.id)} className={post.published ? styles.published : styles.unpublished}>{post.published ? "Published" : "Not Published"}</button>
                <Link to={`/posts/edit/${post.id}`}>Edit</Link>
            </section>
        </section>
    )
}


Post.propTypes = {
    post: PropTypes.object.isRequired,
    publish: PropTypes.func.isRequired,
}


