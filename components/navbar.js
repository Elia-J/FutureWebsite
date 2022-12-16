import React from 'react'
import styles from "/styles/navbar.module.scss"
import LogoAndName from "/components/logoAndName.js";
import Link from 'next/link'

export default function navbar({ about }) {
    // So that we can check if you are on the about page and only have to return two different <li> instead of the whole <ul>
    const data = [1]
    return (
        <ul className={styles.nav}>
            <div className={styles.left}>
                <li className={`${styles.logo}`}>
                    <LogoAndName />
                </li>
                {data.map(() => {
                    if (about) {
                        return (
                            <li key={1}
                                className={`${styles.About} ${styles.active}`}>
                                <Link className={`${styles.listNav}`} href="/about">
                                    About
                                </Link>
                            </li>
                        )
                    }
                    return (
                        <li key={1}
                            className={`${styles.About}`}>
                            <Link className={`${styles.listNav}`} href="/about">
                                About
                            </Link>
                        </li>
                    )
                })
                }

            </div>

            <div className={`${styles.right}`}>
                <li>
                    <Link className={`${styles.listNav} ${styles.signup}`} href="/sign-up">
                        Sign up
                    </Link>
                </li>
                <li>
                    <Link className={`${styles.listNav}`} href="/sign-in">
                        Sign in
                    </Link>
                </li>
            </div>
        </ul>
    )
}
