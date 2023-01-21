import React from 'react'
import styles from "/styles/buttonWithIcon.module.scss"

export default function buttonWithIcon({ icon, text, onClick, active }) {
    return (
        <button className={active ? `${styles.item} ${styles.active}` : `${styles.item} ${styles.notActive}`} onClick={onClick} >
            {icon}
            <div className={styles.iteamText}>{text}</div>
        </button>
    )
}

export function IconsOnly({ icon, onClick }) {
    return (
        <button className={styles.IconsOnlyButton} onClick={onClick} >
            {icon}
        </button>
    )
}

export function TextOnly({ text, onClick }) {
    return (
        <button className={styles.TextOnlyButton} onClick={onClick} >
            {text}
        </button>
    )
}

export function RightIconButton({ icon, text, onClick }) {
    return (
        <button className={styles.rightIconButton} onClick={onClick} >
            {text}
            {icon}
        </button>
    )
}
