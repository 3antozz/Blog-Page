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
            <h3>Antuuuzz</h3>
            {user && <h2>{user.username}</h2>}
            {user ? <button onClick={handleLogout}>Logout</button> : <Link to="/login">Login</Link> }
        </nav>
    )
}


Navbar.propTypes = {
    user: PropTypes.object,
    setUser: PropTypes.func.isRequired,
    setToken: PropTypes.func.isRequired,
}