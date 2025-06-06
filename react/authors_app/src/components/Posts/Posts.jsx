import styles from "./Posts.module.css"
import { useOutletContext } from "react-router";
import { Link } from "react-router";
import { useState } from "react";
import PropTypes from "prop-types";
import { Search } from 'lucide-react';
import { LoaderCircle, Trash2, Pencil, Plus, Asterisk } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;
export default function Posts () {
    const { posts, loading, error, user, publishPost, deletePost } = useOutletContext();
    const [searchValue, setSearchValue] = useState("");
    const [publishError, setPublishError] = useState("")
    const [success, setSuccess] = useState(false);
    const [filter, setFilter] = useState("all");
    const [actionLoading, setActionLoading] = useState(false);
    const handleSearch = (e) => setSearchValue(e.target.value)
    const switchPublishStatus = async (postId) => {
        try {
            setActionLoading(true);
            const token = localStorage.getItem("cred");
            const request = await fetch(`${API_URL}/posts/${postId}/publish`, {
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
            setActionLoading(false);
        } catch(err) {
            setPublishError(err.message);
            setActionLoading(false);
            setTimeout(() => {
                setPublishError("");
            }, 8000)
        }
    }
    const removePost = async (postId) => {
        try {
            setActionLoading(true);
            const token = localStorage.getItem("cred");
            const request = await fetch(`${API_URL}/posts/${postId}`, {
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
            setActionLoading(false);
            deletePost(+postId)
            setPublishError("");
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);;
            }, 8000)
        } catch(err) {
            setActionLoading(false);
            setPublishError(err.message);
            setTimeout(() => {
                setPublishError("");
            }, 8000)
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
                <div className={styles.top}>
                    <div  className={styles.search}>
                        <label htmlFor="search"></label>
                        <input type="text" id="search" value={searchValue} onChange={handleSearch} placeholder="Search for posts..." />
                        <Search className={styles.searchIcon} color="rgb(33, 33, 95)"/>
                    </div>
                    <div className={styles.select}>
                        <Link to='/posts/add' className={styles.add}><Plus /><p>Add Post</p></Link>
                        <label htmlFor="filter">Filter:</label>
                        <select name="" id="filter" defaultValue={"all"} onChange={(e) => setFilter(e.target.value)} >
                            <option value="all" >All posts</option>
                            <option value="published">Published</option>
                            <option value="unpublished">Unpublished</option>
                        </select>
                    </div>
                </div>
                <h1 className={styles.blog}>Blog Posts</h1>
                <section className={styles.posts}>
                    <h2>There are currently no posts!</h2>
                </section>
            </>
        )
    }
    const filteredPosts = posts.filter((post) => {
        if (filter === "published") {
            return post.published === true
        }
        if (filter === "unpublished") {
            return post.published === false
        }
        return post;
    })
    const searchPosts = filteredPosts.filter((post) => {
        if(post.title.includes(searchValue) || post.content.includes(searchValue) || post.author.username.includes(searchValue)){
            return post;
        }
    })
    return (
        <>
            {publishError && <h3 className={styles.error}>{publishError}</h3>}
            {success && <h3 className={styles.success}>Post deleted successfully</h3>}
            <div className={styles.top}>
                <div  className={styles.search}>
                    <label htmlFor="search"></label>
                    <input type="text" id="search" value={searchValue} onChange={handleSearch} placeholder="Search for posts..." />
                    <Search className={styles.searchIcon} color="rgb(33, 33, 95)"/>
                </div>
                <div className={styles.select}>
                    <Link to='/posts/add' className={styles.add}><Plus /><p>Add Post</p></Link>
                    <label htmlFor="filter">Filter:</label>
                    <select name="" id="filter" defaultValue={"all"} onChange={(e) => setFilter(e.target.value)} >
                        <option value="all" >All posts</option>
                        <option value="published">Published</option>
                        <option value="unpublished">Unpublished</option>
                    </select>
                </div>
            </div>
            <h1 className={styles.blog}>Blog Posts</h1>
            <section className={styles.posts}>
                {(searchValue && searchPosts.length === 0) && <h1>No post found</h1>}
                {searchValue ? searchPosts.map((post) => <Post key={post.id} post={post} deletePost={removePost} publishPost={switchPublishStatus}/>) : filteredPosts.map((post) => <Post key={post.id} post={post} deletePost={removePost} publishPost={switchPublishStatus} pending={actionLoading}/>) }
            </section>
        </>
    )
}

function Post ({post, publishPost, deletePost, pending}) {
    return (
        <section className={styles.post}>
            <section className={styles.container}>
                <Asterisk className={styles.external}/>
                <img src={post.cover_url ? post.cover_url : "/istockphoto-1351443977-612x612.jpg"} alt="" />
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
                <p className={styles.date}>{post.creationDate} by <em>{post.author.username}</em></p>
                <button disabled={pending} onClick={() => publishPost(post.id)} className={post.published ? styles.published : styles.unpublished}>{
                 pending ? <LoaderCircle className={styles.icon} /> : post.published ? "Published" : "Not Published"}</button>
                <Link to={`/posts/edit/${post.id}`}><Pencil /></Link>
                <button disabled={pending} onClick={() => deletePost(post.id)} className={styles.delete}>{pending ? <LoaderCircle className={styles.icon}/> : <Trash2 />}</button>
            </section>
        </section>
    )
}


Post.propTypes = {
    post: PropTypes.object.isRequired,
    publishPost: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired 
}


