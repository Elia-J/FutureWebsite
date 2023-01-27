import React from 'react'
import styles from "/styles/loadingLine.module.scss"
import Navbar from "/components/navbar"

//loading animation 
export default function loadingLine({ notYourNote, notYourTask }) {
    return (
        <div>
            <Navbar back={notYourNote} />
            <center><strong>{notYourTask ? "Can't find this task on your profile" : 
                (notYourNote ? "Can't find this note on your profile !" : "You're not yet signed in !")}</strong></center>
            <div className={styles.holder}>
                <div className={styles.line}></div>
            </div>
        </div>
    )
}
