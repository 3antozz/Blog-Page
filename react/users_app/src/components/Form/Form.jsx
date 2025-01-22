import { Outlet } from "react-router"
import styles from "./Form.module.css"
import PropTypes from "prop-types"
import { useOutletContext } from "react-router"


export default function Form ({children}) {
    const { setToken } = useOutletContext();
    return (
        <div className={styles.container}>
            {children}
            <Outlet context={setToken} />
        </div>
    )
}


Form.propTypes = {
    children: PropTypes.object
}

