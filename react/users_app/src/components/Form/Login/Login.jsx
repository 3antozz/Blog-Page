import { useState } from "react";
import { useNavigate } from "react-router";
export default function Login () {
    let navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleUsername = (e) => setUsername(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const request = await fetch('http://localhost:3000/login', {
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
            setError(" ");
            localStorage.setItem("cred", response.token);
            navigate('/')
            console.log(response);
        } catch(err) {
            setError(err.message)
            console.log(err);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            { error && <p>{error}</p> }
            <div>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" onChange={handleUsername} value={username} />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" onChange={handlePassword} value={password} />
            </div>
            <button>Submit</button>
        </form>
    )
}