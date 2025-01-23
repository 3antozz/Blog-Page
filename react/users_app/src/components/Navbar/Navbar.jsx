import styles from "./Navbar.module.css"
import PropTypes from "prop-types"
import { Link, useNavigate, useLocation } from "react-router"
export default function Navbar ({user, setUser, setToken}) {
    const navigate = useNavigate();
    const location = useLocation();
    const handleLogout = () => {
        localStorage.removeItem("cred");
        setUser(() => {
            setToken(null);
            return null
        });
        navigate(location.pathname);
    }
    return (
        <nav className={styles.nav}>
            <Link><h1>Antuuuz Blog</h1></Link>
            {user && <h2>{user.username}</h2>}
            {user ? <button onClick={handleLogout}>Logout</button> : 
            <div className={styles.login}>
                <Link to="/login">Login</Link>
                <Link to="/sign-up">Register</Link>
            </div>
             }
        </nav>
    )
}


Navbar.propTypes = {
    user: PropTypes.object,
    setUser: PropTypes.func.isRequired,
    setToken: PropTypes.func.isRequired,
}