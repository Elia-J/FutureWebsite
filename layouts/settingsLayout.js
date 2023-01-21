//this layout is used to display the setting left sidebar.
import React, { useEffect, useState } from 'react'
import styles from "/styles/settingsLayout.module.scss"
import { motion } from "framer-motion"
import CloseIcon from "/public/close.svg"

import { useStateStoreContext } from "/layouts/stateStore"

export default function SettingsLayout({ children, title, onSave, test }) {


    const [showSettings, setShowSettings, shortcutsPanel, setShortcutsPanel, settings, setSettings, saveButton, setSaveButton, settingsCopy, setSettingsCopy] = useStateStoreContext();

    const [data, setData] = useState()



    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.settingsLayoutContainer}
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
