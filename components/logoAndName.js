import React from 'react'
import Logo from "/public/LogoSvg.svg"
import styles from "/styles/logoAndName.module.scss"
import Link from 'next/link'

export default function logoAndName() {
    return (

        <Link href="/" className={styles.brandLogo}>

            <Logo />
            <div className={styles.logoName}>Future.io</div>

        </Link>

    )
}

