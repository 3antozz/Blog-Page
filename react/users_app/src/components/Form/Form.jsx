import { Outlet } from "react-router"
import styles from "./Form.module.css"


export default function Form () {
    return (
        <div className={styles.container}>
            <Outlet />
        </div>
    )
}