import Link from 'next/link'
import React from 'react'
import styles from "/styles/simpleLink.module.scss"

//simple link component
export default function simpleButton({ LinkTo, text }) {
    return (
        <Link href={`${LinkTo}`} className={styles.Link}>{text}</Link>
    )
}
