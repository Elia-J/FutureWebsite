import React from 'react'
import styles from "/styles/loadingLine.module.scss"

//loading animation 
export default function loadingLine() {
    return (
        <div class={styles.holder}>
            <div class={styles.line}></div>
        </div>
    )
}
