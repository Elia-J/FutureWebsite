import React from 'react'
import styles from "/styles/loadingPlaceHolder.module.scss"

//loading animation
export default function loadingPlaceHolder() {
    return (
        <>
            <div className={styles.animation}></div>
            <div className={styles.animation}></div>
            <div className={styles.animation}></div>
        </>
    )
}
