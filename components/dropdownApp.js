import React, { useRef } from 'react'
import styles from "/styles/dropdownApp.module.scss"
import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import ButtonWithIcon from './buttons'
import Image from 'next/image'

import { useStateStoreContext } from "/layouts/stateStore"

//icons
import Settings from "/public/Settings.svg"
import Logout from "/public/Logout.svg"
import Home from "/public/home.svg"
import Message from "/public/message.svg"
import Shortcut from "/public/shortcut.svg"

//theme
import { useTheme } from 'next-themes'



export default function DropdownApp({ settingsState }) {

    //supabase
    const supabase = useSupabaseClient()
    const session = useSession()
    const user = useUser()

    const router = useRouter()

    const [collapse, setCollapse] = useState(true);
    const dropdownIteam = collapse ? `${styles.dropdownListClose} ${styles.dropdownList}` : `${styles.dropdownListOpen} ${styles.dropdownList}`;

    const [showSettings, setShowSettings, shortcutsPanel, setShortcutsPanel, settings, setSettings, saveButton, setSaveButton, settingsCopy, setSettingsCopy, warningPanel, setWarningPanel] = useStateStoreContext();

    //sign out function
    async function handleSignOut() {

        const { error } = await supabase.auth.signOut()

        if (error) alert(error.message)

        if (!error) {
            //redirect to home page using next router
            router.push("/")
        }
    }

    async function updateThemeIndatabase(theme1) {
        const { error } = await supabase
            .from('profiles')
            .update({ mode: theme1 })
            .eq('id', user.id)
        if (error) {
            console.log(error)
        }

    }

    //theme change, click counter until 3
    const { theme, setTheme } = useTheme()
    let count

    function themeToNumber() {
        if (theme == "light") {
            count = 1
        }
        else if (theme == "dark") {
            count = 2
        }
        else if (theme == "system") {
            count = 3
        }
    }

    themeToNumber()

    function counter() {
        if (count < 3) {
            count++
            handleTheme()
        }
        else {
            count = 1
            handleTheme()
        }
    }

    //function handle theme
    function handleTheme() {
        if (count == 1) {
            setTheme("light")
            updateThemeIndatabase("light")
        }
        else if (count == 2) {
            setTheme("dark")
            updateThemeIndatabase("dark")
        }
        else if (count == 3) {
            setTheme("system")
            updateThemeIndatabase("system")
        }
    }


    return (
        <div className={styles.dropdown} id="dropdownHolder">

            <div className={styles.profileImage} onClick={
                () => {
                    setCollapse(!collapse)
                    // collapse ? addDropdownList() : removeDropdownList()
                }
            }
            >
                <Image
                    src={settings.avatar_url}
                    alt="Profile Image"
                    fill
                    className={styles.image}
                />
            </div>

            <div className={dropdownIteam} id="dropdownList"
            //  ref={dropdownList}
            >
                <ButtonWithIcon
                    icon={<Settings />}
                    text="Settings"
                    onClick={() => {
                        settingsState(),
                            setCollapse(!collapse)
                    }}
                />

                <ButtonWithIcon
                    icon={<Settings />}
                    text={`${theme} Mode`}
                    onClick={counter}
                />

                <ButtonWithIcon
                    icon={<Shortcut />}
                    text="Shortcut"
                    onClick={() => {
                        // router.push("/shortcut"), setCollapse(!collapse)
                        setShortcutsPanel(!shortcutsPanel)
                        setCollapse(!collapse)
                    }}
                />

                <ButtonWithIcon
                    icon={<Home />}
                    text="Home Page"
                    onClick={() => {
                        router.push("/"), setCollapse(!collapse)
                    }}
                />

                <ButtonWithIcon
                    icon={<Message />}
                    text="Contact Us"
                    onClick={() => {
                        router.push("/about"), setCollapse(!collapse)
                    }}
                />

                <ButtonWithIcon
                    icon={<Logout />}
                    text="Sign Out"
                    onClick={() => {
                        handleSignOut(),
                            setCollapse(!collapse)
                    }}
                />


                {/* version number */}
                <div className={styles.version}>v0.1.9</div>

            </div>

        </div>
    )
}

