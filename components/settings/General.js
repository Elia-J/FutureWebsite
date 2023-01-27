import React, { useEffect, useState } from 'react'
import SettingsLayout from '../../layouts/settingsLayout'
import styles from '/styles/general.module.scss'

//global variable
import { useStateStoreContext } from "/layouts/stateStore"

//theme
import { useTheme } from 'next-themes'

export default function General() {

    //moment-timezone
    const moment = require('moment-timezone');

    //variables
    const [dataAndTime, setDataAndTime] = useState()

    //List of time zones
    const timeZonesFromMoment = moment.tz.names();


    //global variables
    const [showSettings, setShowSettings, shortcutsPanel, setShortcutsPanel, settings, setSettings, saveButton, setSaveButton, settingsCopy, setSettingsCopy, warningPanel, setWarningPanel] = useStateStoreContext();

    const { theme, setTheme } = useTheme()

    const [checkboxThemeSync, setCheckboxThemeSync] = useState(false)
    const [timeZone, setTimeZone] = useState('')


    //change theme by clicking on dropdown menu in settings
    function changeTheme(e) {
        setTheme(e.target.value)
    }

    //using moment-timezone to get the current time and date based on the time zone
    function getDataAndTime() {
        const date = moment().tz(`${settings.time_zone}`).format('MMMM Do YYYY, h:mm:ss a');
        setDataAndTime(date)
    }

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
                    <div className={styles.discription}>Your time zone is used to display the time in your calendar. <br />PLEASE NOTE:
                        This feature is currently in development. The calendar time zone is set to your browser time zone by default.</div>


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
            <Toaster position="bottom-right" reverseOrder={false} />
        </SettingsLayout >
    )
}
