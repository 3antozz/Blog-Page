import styles from "./Navbar.module.css"
import PropTypes from "prop-types"
import { Link } from "react-router"
export default function Navbar ({user}) {
    const handleLogout = () => {
        localStorage.removeItem("cred");
        window.location.reload();
    }
    return (
        <nav className={styles.nav}>
            <Link to="/"><h1>Blog Authors</h1></Link>
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
}