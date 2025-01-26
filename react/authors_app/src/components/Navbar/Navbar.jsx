import styles from "./Navbar.module.css"
import PropTypes from "prop-types"
import { Link, useNavigate, useLocation } from "react-router"
export default function Navbar ({user, setUser, setToken}) {
    const navigate = useNavigate();
    const location = useLocation();
    const handleLogout = () => {
        localStorage.removeItem("cred");
        setUser(null)
        setToken(null);
        navigate(location.pathname);
    }
    return (
        <nav className={styles.nav}>
            <Link to="/"><h1>Antuuuz Blog</h1></Link>
            {user ?
            <div className={styles.login}>
                <h3>{user.username}</h3>
                <button onClick={handleLogout} className={styles.logout}>Logout</button>
            </div> : 
            <div className={styles.login}>
                <Link to="/login">Login</Link>
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