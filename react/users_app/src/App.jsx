import { Outlet } from "react-router";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;
function App() {
    const [isFetched, setFetched] = useState(false)
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [error, setError] = useState("")
    const [token, setToken] = useState(localStorage.getItem("cred"));
    const [loading, setLoading] = useState(false);
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
            setLoading(true);
            const fetchPosts = async () => {
                try {
                    const request = await fetch(`${API_URL}/posts`, {
                        method: 'GET',
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
                        setLoading(false)
                    }
                } catch (err) {
                    setLoading(false)
                    setError(err.message);
                }
            };
            fetchPosts();
        }
        return () => {
            ignore = true
        }
    }, [isFetched]);
    return (
        <>
            <Navbar user={user} setUser={setUser} setToken={setToken}/>
            <main>
                <Outlet context={{posts, user, loading, error, setToken}}/>
            </main>
        </>
    );
}

export default App;
