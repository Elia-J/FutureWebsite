import React from 'react'
import Image from 'next/image'
import LogoAndName from '/components/logoAndName.js'
import styles from "/styles/signInAndOutLayout.module.scss"

export default function SignInAndOutLayout({ children, title, image }) {
    return (
        <section className={styles.container}>

            <div className={styles.bgImage}>

                <div className={styles.bgGradient}></div>
                <Image
                    src={image}
                    alt="Bg Image"
                    fill
                    className={styles.Image}
                />

            </div>

            <div className={styles.leftPanel}>
                <LogoAndName />

                <div className={styles.leftPanelContent}>
                    <h1 className={styles.Title}>{title}</h1>

                    {children}

                </div>
            </div>
        </section>
    )
}
