import { Outlet } from "react-router";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;
function App() {
    const [isFetched, setFetched] = useState(false)
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("")
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("cred"));

    const publishPost = (postId) => {
        setPosts((prev) => {
            return prev.map((post) => {
                if(post.id == postId) {
                    return {...post, published: !post.published}
                }
                return post
            })
        })
    }

    const deletePost = (postId) => {
        setPosts((prev) => {
            return prev.filter((post) => post.id != postId)
        })
    }
    useEffect(() => {
        const fetchUser = async () => {
            if(token) {
                try {
                    const request = await fetch(`${API_URL}/user`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        mode: "cors",
                    });
                    const response = await request.json();
                    if (!request.ok) {
                        setUser(null);
                        throw new Error(response.message || 'Something went wrong');
                    }
                    setUser(response.user)
                } catch (err) {
                    console.log(err)
                }
            }
        }
        fetchUser();
    }, [token])
    useEffect(() => {
        let ignore = false;
        if (!isFetched) {
            const fetchPosts = async () => {
                try {
                    const request = await fetch(`${API_URL}/posts/all`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        mode: "cors",
                    });
                    const response = await request.json();
                    if (!request.ok) {
                        throw new Error(response.message || 'Something went wrong');
                    }
                    if (!ignore) {
                        setPosts(response.posts)
                        setFetched(true);
                        setError("")
                    }
                    console.log(response);
                } catch (err) {
                    setError(err.message);
                    console.log(err)
                }
            };
            fetchPosts();
        }
        return () => {
            ignore = true
        }
    }, [isFetched, token]);
    return (
        <>
            <Navbar user={user} setUser={setUser} setToken={setToken}/>
            <main>
                <Outlet context={{posts, user, setToken, setFetched, error, publishPost, deletePost}}/>
            </main>
        </>
    );
}

export default App;
