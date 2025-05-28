import styles from "./Navbar.module.css"
import PropTypes from "prop-types"
import { Link } from "react-router"
const AUTHORS_URL = import.meta.env.VITE_AUTHORS_URL;
export default function Navbar ({user}) {
    const handleLogout = () => {
        localStorage.removeItem("cred");
        window.location.reload();
    }
    return (
        <nav className={styles.nav}>
            <Link to="/"><h1>Antuuuz Blog</h1></Link>
            <div className={styles.login}>
                <Link to={AUTHORS_URL}>Authors</Link>
                {user ?
                <>
                    <h3>{user.username}</h3>
                    <button onClick={handleLogout} className={styles.logout}>Logout</button>
                </> :
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/sign-up">Register</Link>
                </>
                }
            </div>
        </nav>
    )
}


Navbar.propTypes = {
    user: PropTypes.object,
}