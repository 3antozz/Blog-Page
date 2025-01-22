import { Outlet } from "react-router";
import "./App.css";
import { useEffect, useState } from "react";
function App() {
    const [isFetched, setFetched] = useState(false)
    const [posts, setPosts] = useState([]);
    const [isLoggedIn, setLog] = useState(false)
    useEffect(() => {
        if (!isFetched) {
            const token = localStorage.getItem("cred");
            const isLoggedIn = !!token;
            const headers = isLoggedIn
                ? {
                      method: "GET",
                      Authorization: `Bearer ${token}`,
                  }
                : { method: "GET" };
            const fetchPosts = async () => {
                try {
                    const request = await fetch("http://localhost:3000/posts", {
                        headers: headers,
                        mode: "cors",
                    });
                    const response = await request.json();
                    if (!request.ok) {
                        throw new Error(response.message || 'Something went wrong');
                    }
                    setPosts(() => {
                        setLog(isLoggedIn);
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
    }, []);
    return (
        <div>
            <nav>
                <h3>NAVIGATION BAR</h3>
            </nav>
            <Outlet context={{posts, isLoggedIn}}/>
        </div>
    );
}

export default App;
