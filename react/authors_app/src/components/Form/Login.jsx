import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useOutletContext } from "react-router"
const API_URL = import.meta.env.VITE_API_URL;
export default function Login () {
    const {setToken, user} = useOutletContext();
    let navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (user) {
            return navigate('/');
        }
    })

    const handleUsername = (e) => setUsername(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const request = await fetch(`${API_URL}/admin-login`, {
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                },
                mode: "cors",
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            const response = await request.json();
            if (!request.ok) {
                throw new Error(response.message || 'Something went wrong');
            }
            localStorage.setItem("cred", response.token);
            setToken(response.token)
            setError("");
            navigate('/')
        } catch(err) {
            setError(err.message)
            console.log(err);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            { error && <li>{error}</li> }
            <div>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" onChange={handleUsername} value={username} required />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" onChange={handlePassword} value={password} required />
            </div>
            <button>Log in</button>
        </form>
    )
}


