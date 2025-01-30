import { useNavigate, useOutletContext, Link } from "react-router";
import { useState, useEffect } from "react";
import styles from "./Form.module.css"
const API_URL = import.meta.env.VITE_API_URL;
export default function SignUp () {
    let navigate = useNavigate();
    const {user} = useOutletContext();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if (user) {
            return navigate('/');
        }
    })

    const handleUsername = (e) => setUsername(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);
    const handlePasswordConfirmation = (e) => setConfirmPassword(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const request = await fetch(`${API_URL}/sign-up`, {
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                },
                mode: "cors",
                body: JSON.stringify({
                    username: username,
                    password: password,
                    confirm_password: confirmPassword
                })
            })
            const response = await request.json();
            if (!request.ok) {
                const error = new Error('Incorrect information');
                error.messages = response.errors || [error.message];
                throw error;
            }
            setErrors([])
            setSuccess(true);
            setUsername("");
            setPassword("");
            setConfirmPassword("");
            
        } catch(err) {
            setErrors(err.messages)
            setSuccess(false);
            console.log(err);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            { errors && errors.map((error, index) => <li key={index}>{error}</li>) }
            { success && <li className={styles.success}>Registration successful! You can login <Link to="/login">here</Link></li> }
            <div>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" onChange={handleUsername} value={username} />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" onChange={handlePassword} value={password} />
            </div>
            <div>
                <label htmlFor="confirm_password">Confirm Password</label>
                <input type="password" id="confirm_password" onChange={handlePasswordConfirmation} value={confirmPassword} />
            </div>
            <button>Sign Up</button>
            <p>Already have an account? <Link to='/login'>Login here</Link></p>
        </form>
    )
}