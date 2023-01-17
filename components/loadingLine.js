import React from 'react'
import styles from "/styles/loadingLine.module.scss"

//loading animation 
export default function loadingLine() {
    return (
        <div className={styles.holder}>
            <div className={styles.line}></div>
        </div>
    )
}
