import React, { useEffect, useState } from 'react'
import SettingsLayout from '../../layouts/settingsLayout'
import styles from '/styles/general.module.scss'

//global variable
import { useStateStoreContext } from "/layouts/stateStore"

//theme
import { useTheme } from 'next-themes'
import { request } from 'http'

export default function General() {


    //moment-timezone
    const moment = require('moment-timezone');

    //variables
    const [dataAndTime, setDataAndTime] = useState()

    //generate a list of time zones using moment-timezone only names
    const timeZonesFromMoment = moment.tz.names();

    const { theme, setTheme } = useTheme()

    const [checkboxThemeSync, setCheckboxThemeSync] = useState(false)
    const [removeCheckedTasks, setRemoveCheckedTasks] = useState()
    const [showTimeForTasks, setShowTimeForTasks] = useState()
    const [timeZone, setTimeZone] = useState('')
    const [firstDayOfWeek, setFirstDayOfWeek] = useState('')


    const [showSettings, setShowSettings, shortcutsPanel, setShortcutsPanel, settings, setSettings, saveButton, setSaveButton, settingsCopy, setSettingsCopy, warningPanel, setWarningPanel] = useStateStoreContext();

    //change theme by clicking on dropdown menu in settings
    function changeTheme(e) {
        setTheme(e.target.value)
    }


    //using moment-timezone to get the current time and date
    function getDataAndTime() {
        const date = moment().tz(`${settings.time_zone}`).format('MMMM Do YYYY, h:mm:ss a');
        setDataAndTime(date)
    }


    //Get data from database on page load
    async function GetData() {
        const { data, error } = await supabase
            .from('profiles')
            .select(`syncTheme , timeZone, firstDayOfWeek, mode, removeCheckedTasks, showTimeForTasks`)
            .eq('id', user.id)
            .single()

        if (error) {
            console.log(error)
        }
        if (data) {
            setCheckboxThemeSync(data.syncTheme)
            setTimeZone(data.timeZone)
            setRemoveCheckedTasks(data.removeCheckedTasks)
            setShowTimeForTasks(data.showTimeForTasks)
            console.log(data.timeZone)
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


    //update removeCheckedTasks in database
    async function UpdateRemoveCheckedTasks(e) {
        const { data, error } = await supabase
            .from('profiles')
            .update({ removeCheckedTasks: e })
            .eq('id', user.id)

        if (error) {
            console.log(error)
        }
        else {
            console.log(data)
        }
    }

    // update showTimeForTasks
    async function UpdateShowTimeForTasks(e) {
        const { data, error } = await supabase
            .from('profiles')
            .update({ showTimeForTasks: e })
            .eq('id', user.id)

        if (error) {
            console.log(error)
        }
        else {
            console.log(data)
        }
    }

    function lg() {
        console.log(checkboxThemeSync)
    }

    //note done yet
    // useEffect(() => {
    //     if (checkboxThemeSync == true) {
    //         UpdateTheme(theme)
    //     }
    // }, [theme, changeTheme, checkboxThemeSync])

    useEffect(() => {
        getDataAndTime()

        const interval = setInterval(() => {
            getDataAndTime()
        }
            , 1000);
        return () => clearInterval(interval);

    }, [settings.time_zone])


    return (
        <SettingsLayout title="General">


            <div className={styles.optionsVertical}>

                <div className={styles.details}>

                    <div className={styles.minititle}>Time Zone</div>
                    <div className={styles.discription}>Your time zone is used to display the time in your calendar.</div>

                </div>

                <select name="timeZone" id="timeZone" className={styles.select}
                    onChange={(e) => { setSettings({ ...settings, time_zone: e.target.value }) }}
                >
                    {timeZonesFromMoment.map((zone) => (
                        <option key={zone}
                            value={zone}
                            selected={zone === `${settings.time_zone}` ? "selected" : null}
                        >
                            {zone}
                        </option>
                    ))}

                </select>
                <p className={styles.dateAndTime}>{dataAndTime} </p>

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


            <div className={styles.optionsHorizontal}>
                <div className={styles.details}>
                    <div className={styles.minititle}>Automatically removing checked tasks</div>
                    <div className={styles.discription}>Automatically remove tasks when you click on their checkbox</div>
                </div>
                <div className={styles.toggleContainer}>
                    <input type="checkbox" name="removetoggle" id="removetoggle" className={styles.toggleInput}
                        onChange={() => { setRemoveCheckedTasks(!removeCheckedTasks), UpdateRemoveCheckedTasks(!removeCheckedTasks) }} checked={removeCheckedTasks}
                    />
                    <label htmlFor="removetoggle" className={styles.toggleLabel}></label>
                </div>
            </div>

            <div className={styles.optionsHorizontal}>
                <div className={styles.details}>
                    <div className={styles.minititle}>Show time for tasks</div>
                    <div className={styles.discription}>Show the time for tasks instead of the date</div>
                </div>
                <div className={styles.toggleContainer}>
                    <input type="checkbox" name="showTimeToggle" id="showTimeToggle" className={styles.toggleInput}
                        onChange={() => { setShowTimeForTasks(!showTimeForTasks), UpdateShowTimeForTasks(!showTimeForTasks) }} checked={showTimeForTasks}
                    />
                    <label htmlFor="showTimeToggle" className={styles.toggleLabel}></label>
                </div>
            </div>
            <Toaster position="bottom-right" reverseOrder={false} />


        </SettingsLayout >
    )
}
