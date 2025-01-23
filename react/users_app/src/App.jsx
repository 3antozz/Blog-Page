import { Outlet } from "react-router";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { useEffect, useState } from "react";
function App() {
    const [isFetched, setFetched] = useState(false)
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("cred"));
    useEffect(() => {
        const fetchUser = async () => {
            if(token) {
                try {
                    const request = await fetch("http://localhost:3000/user", {
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
        if (!isFetched) {
            const fetchPosts = async () => {
                try {
                    const request = await fetch("http://localhost:3000/posts", {
                        method: 'GET',
                        mode: "cors",
                    });
                    const response = await request.json();
                    if (!request.ok) {
                        throw new Error(response.message || 'Something went wrong');
                    }
                    setPosts(() => {
                        setFetched(true);
                        return response.posts
                    });
                    console.log(response);
                } catch (err) {
                    console.log(err)
                }
            };
            fetchPosts();
        }
    }, [isFetched]);
    return (
        <>
            <Navbar user={user} setUser={setUser} setToken={setToken}/>
            <main>
                <Outlet context={{posts, user, setToken}}/>
            </main>
        </>
    );
}

export default App;
