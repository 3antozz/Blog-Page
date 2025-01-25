import { Outlet } from "react-router"
import styles from "./Form.module.css"
import PropTypes from "prop-types"
import { useOutletContext, useLocation } from "react-router"


export default function Form () {
    const { setToken, user } = useOutletContext();
    const location = useLocation();
    return (
        <div className={styles.container}>
            { location.pathname === '/login' ? <h1>Login</h1> : location.pathname === '/sign-up' ? <h1>Sign up</h1> : ""}
            <div className={styles.formContainer}>
                <Outlet context={{setToken, user}} />
            </div>
        </div>
    )
}


Form.propTypes = {
    children: PropTypes.object
}

