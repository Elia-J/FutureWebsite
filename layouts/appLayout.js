import Link from 'next/link'
import React, { useState } from 'react'
import styles from "/styles/appLayout.module.scss"
import { motion } from "framer-motion"
import { useSettingsContext } from "/layouts/stateStore"

//components
import Settings from '/components/settings/settingsComponent'
import DropdownApp from '/components/dropdownApp'

//icons
import Calendar from "/public/Calendar.svg"
import Document from "/public/Document.svg"
import Tasks from "/public/Tasks.svg"
import Search from "/public/Search.svg"

//planning to use react context because Context provides a way to pass data through the component tree without having to pass props down manually at every level.

export default function Setting1({ children }) {
    //provider
    const [showSettings, setShowSettings] = useSettingsContext();
    console.log(showSettings)

    const [setting, setSetting] = useState(false);
    const bgClick = showSettings ? `${styles.clickable}` : `${styles.Notclickable}`;

    const changesettingsState = () => {
        setShowSettings(!showSettings)
    }

    //setting popup animation 
    const variants = {
        open: {
            opacity: 1,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(55,55,55,0.5)",
            zIndex: 50,
            transition: {
                duration: 0.3,
                staggerChildren: 0.3,
                delayChildren: 0.3
            }

        },

        closed: {
            opacity: 0,
            backdropFilter: "blur(0px)",
            backgroundColor: "rgba(0,0,0,0)",
            zIndex: -1,
        },
    }

    return (
        <div className={styles.mainPage}>

            <div className={styles.dynamic}>

                <div className={styles.sidebar}>

                    <DropdownApp settingsState={changesettingsState} />

                    <Link href="/app" className={styles.box}>
                        <Calendar />
                    </Link>

                    <Link href="/app/note" className={styles.box}>
                        <Document />
                    </Link>

                    <Link href="/app/tasks" className={styles.box}>
                        <Tasks />
                    </Link>

                    <Link href="/app/search" className={styles.box}>
                        <Search />
                    </Link>

                </div>

                <div className={styles.mainContent}>
                    {children}
                </div>

            </div>

            <motion.div
                animate={showSettings ? "open" : "closed"}
                variants={variants}
                className={styles.settings} >

                <Settings settingsState={changesettingsState} />

                <div className={`${styles.blackBG} ${bgClick}`} onClick={() => setShowSettings(!showSettings)}></div>

            </motion.div>

        </div>
    )
}
