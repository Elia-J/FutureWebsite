import React from 'react'
import styles from "/styles/loadingLine.module.scss"
import Navbar from "components/navbar"

//loading animation 
export default function loadingLine() {
    return (
        <div>
            <Navbar />
            <center><strong>You&apos;re not yet signed in</strong></center>
            <div className={styles.holder}>
                <div className={styles.line}></div>
            </div>
        </div>
    )
}
