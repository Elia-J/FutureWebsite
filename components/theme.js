import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import styles from "../styles/themes.module.scss";

export default function Theme() {
    const { theme, setTheme } = useTheme() // Set the theme.
    const [mounted, setMounted] = useState(false) // Set the state of the theme.

    useEffect(() => {
        // Apply the effect to the component only when the component is mounted.
        setMounted(true)

    }, [])

    if (!mounted) return null // no need to render anything until we know the theme

    window.onclick = function (event) {
        if (!(event.target.classList[0] == `${styles.dropbtn}`)) {

            var dropdowns = document.getElementsByClassName(`${styles.dropdownContent}`);

            for (var i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];

                if (openDropdown.classList.contains(`${styles.show}`)) {
                    openDropdown.classList.remove(`${styles.show}`);
                }
            }
        }
    }

    return (
        <div className={styles.DropDownDiv}>

            <button className={styles.dropbtn} onClick={() => document.getElementById("DropDownButtonsDiv").classList.toggle(`${styles.show}`)}>Themes</button>

            <div id="DropDownButtonsDiv" className={styles.dropdownContent}>

                <button onClick={() => setTheme('light')}>Light Mode</button>
                <button onClick={() => setTheme('dark')}>Dark Mode</button>
                <button onClick={() => setTheme('system')}>System Mode</button>

            </div>
        </div>
    )
}
