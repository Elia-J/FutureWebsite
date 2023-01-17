import React, { useEffect, useState } from 'react'
import SettingsLayout from '../../layouts/settingsLayout'
import styles from '/styles/general.module.scss'
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import toast, { Toaster } from 'react-hot-toast';

//global variable
import { useStateStoreContext } from "/layouts/stateStore"

//theme
import { useTheme } from 'next-themes'

export default function General() {
    const supabase = useSupabaseClient()
    const session = useSession()
    const user = useUser()

    const timeZones = Intl.supportedValuesOf('timeZone')

    const { theme, setTheme } = useTheme()
    const [checkboxThemeSync, setCheckboxThemeSync] = useState(false)
    const [timeZone, setTimeZone] = useState('')
    const [firstDayOfWeek, setFirstDayOfWeek] = useState('')

    const [showSettings, setShowSettings, shortcutsPanel, setShortcutsPanel, settings, setSettings, saveButton, setSaveButton, settingsCopy, setSettingsCopy] = useStateStoreContext();

    //change theme by clicking on dropdown menu in settings
    function changeTheme(e) {
        setTheme(e.target.value)
    }


    //Get data from database on page load
    async function GetData() {
        const { data, error } = await supabase
            .from('profiles')
            .select(`syncTheme , timeZone, firstDayOfWeek, mode`)
            .eq('id', user.id)
            .single()

        if (error) {
            console.log(error)
        }
        if (data) {
            setCheckboxThemeSync(data.syncTheme)
            setTimeZone(data.timeZone)
            // setFirstDayOfWeek(data.firstDayOfWeek)
            // setTheme(data.mode)
        }

    }


    //update boolean value in database
    async function updateThemeBoolean() {
        const { data, error } = await supabase
            .from('profiles')
            .update({ syncTheme: !checkboxThemeSync })
            .eq('id', user.id)
        if (error) {
            console.log(error)
            toast.error(error.message)
        }
        if (data) {
            console.log(data)
            toast.success('Theme sync updated')
        }

    }

    //update time zone in database
    // async function UpdateTimeZone(e) {
    //     const { data, error } = await supabase
    //         .from('profiles')
    //         .update({ timeZone: e })
    //         .eq('id', user.id)

    //     if (error) {
    //         console.log(error)
    //     }
    //     else {
    //         console.log(data)
    //     }
    // }

    //updat theme in database
    // async function UpdateTheme(e) {
    //     const { data, error } = await supabase
    //         .from('profiles')
    //         .update({ mode: e })
    //         .eq('id', user.id)

    //     if (error) {
    //         toast.error(error.message)
    //     }
    //     else {
    //         toast.success('Theme updated', {
    //             iconTheme: {
    //                 primary: '#4C7987',
    //                 secondary: '#ffffff',
    //             }
    //         });
    //     }


    // }



    //note done yet
    // useEffect(() => {
    //     if (checkboxThemeSync == true) {
    //         UpdateTheme(theme)
    //     }
    // }, [theme, changeTheme, checkboxThemeSync])

    useEffect(() => {
        GetData()
    }, [])

    return (
        <SettingsLayout title="General">


            <div className={styles.optionsVertical}>

                <div className={styles.details}>

                    <div className={styles.minititle}>Time Zone</div>
                    <div className={styles.discription}>Your time zone is used to display the time in your calendar.</div>

                </div>

                <select name="timeZone" id="timeZone" className={styles.select}
                    onChange={(e) => { setSettings({ ...settings, TimeZone: e.target.value }) }}
                >

                    <option value="Local" selected={"Local" === `${settings.TimeZone}` ? "selected" : null}>Local</option>
                    {timeZones.map((zone) => (
                        <option key={zone}
                            value={zone}
                            selected={zone === `${settings.TimeZone}` ? "selected" : null}
                        >
                            {zone}
                        </option>
                    ))}

                </select>

            </div>


            <div className={styles.optionsVertical}>

                <div className={styles.details}>
                    <div className={styles.minititle}>Theme</div>
                    <div className={styles.discription}> Choose between light, dark, and system theme.</div>
                </div>

                <select name="theme" id="theme" className={styles.select}
                    onChange={
                        (e) => {
                            setSettings({ ...settings, Theme: e.target.value })
                            changeTheme(e)
                        }
                    }
                    value={theme}
                >

                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>

                </select>

            </div>

            <div className={styles.optionsVertical}>

                <div className={styles.details}>

                    <div className={styles.minititle}>Theme Synchronization</div>
                    <div className={styles.discription}>Synchronize your theme with your account, so that it is applied to all your devices.</div>

                </div>

                <div className={styles.toggleContainer}>
                    <input type="checkbox" name="toggle" id="toggle" className={styles.toggleInput}
                        onChange={() => {
                            setSettings({ ...settings, syncTheme: !settings.syncTheme })
                        }} checked={settings.syncTheme}
                    />
                    <label htmlFor="toggle" className={styles.toggleLabel}></label>
                </div>

            </div>

            <Toaster position="bottom-right" reverseOrder={false} />


        </SettingsLayout >
    )
}
