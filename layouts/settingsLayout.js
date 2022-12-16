//this layout is used to display the setting left sidebar.
import React, { useEffect, useState } from 'react'
import styles from "/styles/settingsLayout.module.scss"
import { motion } from "framer-motion"
import CloseIcon from "/public/close.svg"

import { useSettingsContext } from "/layouts/stateStore"

export default function SettingsLayout({ children, title, showSaveButton, onSave, test }) {


    const [showSettings, setShowSettings] = useSettingsContext();
    const [data, setData] = useState()

    useEffect(() => {
        if (showSaveButton) {
            return (
                setData(

                    <div className={styles.savaAndCancelButtons}>
                        <button className={`${styles.cancelButton} ${styles.buttong}`} onClick={test}>Cancel</button>
                        <button className={`${styles.saveButton} ${styles.buttong}`} onClick={onSave}>Save</button>
                    </div>

                )
            )
        }

        else {
            //empty the data
            setData()
        }
    }, [showSaveButton])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >

            <div className={styles.title}>
                {title}

                <button className={styles.closeButton} onClick={() => { setShowSettings(false) }}>
                    <CloseIcon />
                </button>

            </div>

            <div className={styles.settingsLayout}>
                {children}
            </div>

            {data}

        </motion.div>
    )
}
