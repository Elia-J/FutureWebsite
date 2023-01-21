import React, { useState } from 'react'
import SettingsLayout from '../../layouts/settingsLayout'
import styles from '/styles/general.module.scss'
import { useStateStoreContext } from "/layouts/stateStore"

export default function CalendarSetting() {

    //array of days
    const dayOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']


    //global state/variables
    const [showSettings, setShowSettings, shortcutsPanel, setShortcutsPanel, settings, setSettings, saveButton, setSaveButton, settingsCopy, setSettingsCopy, warningPanel, setWarningPanel] = useStateStoreContext();
    console.log("show weekends " + settings.ShowWeekends)


    //variables
    const [beginTime, setBeginTime] = useState(settings.BeginTimeDay)
    const [endTime, setEndTime] = useState(settings.EndTimeDay)

    function handleBeginTimeAndEndTime() {
        //convert timet to time with timeZone UTC

    }

    return (

        <SettingsLayout title="Calendar">

            <div className={styles.optionsVertical}>

                <div className={styles.details}>

                    <div className={styles.minititle}>First day of the week</div>
                    <div className={styles.discription}> Choose the first day of the week in your calendar. </div>

                </div>

                <select name="FirstDayOfTheWeek" id="FirstDayOfTheWeek" className={styles.select}
                    onChange={(e) => {
                        setSettings({ ...settings, FirstDayOfTheWeek: e.target.value })
                    }}
                >

                    {dayOfWeek.map((day) => (
                        <option key={day} value={day} selected={day === `${settings.FirstDayOfTheWeek}` ? "selected" : null}>
                            {day}
                        </option>
                    ))}

                </select>

            </div>


            <div className={styles.optionsVertical}>

                <div className={styles.details}>

                    <div className={styles.minititle}>Limit the timeline</div>
                    <div className={styles.discription}>Choose maximum and minimum time to limit the view of the timeline.</div>

                </div>

                <div className={styles.timeLimit}>
                    {/* <label htmlFor="beginTimeDay">Begin</label> */}
                    <input type="time" name="beginTimeDay" id="beginTimeDay" className={styles.timeInput}
                        onChange={(e) => {
                            setSettings({ ...settings, BeginTimeDay: e.target.value })
                        }}
                        value={settings.BeginTimeDay}

                    />
                    {/* <label htmlFor="endTimeDay">End</label> */}
                    <input type="time" name="endTimeDay" id="endTimeDay" className={styles.timeInput}
                        onChange={(e) => {
                            setSettings({ ...settings, EndTimeDay: e.target.value })
                        }}
                        value={settings.EndTimeDay}
                    />


                </div>

                <div className={styles.state}>
                    <p className={styles.stateText}>
                        Posible values
                    </p>
                    <span className={`${styles.circle} ${styles.circlePrimeColor}`}></span>
                </div>
            </div>


            <div className={styles.optionsVertical}>

                <div className={styles.details}>

                    <div className={styles.minititle}>Show weekends</div>
                    <div className={styles.discription}>
                        Choose whether to show weekends in your calendar.
                    </div>

                </div>

                <div className={styles.timeLimit}>

                    <div className={styles.toggleContainer}>
                        <input type="checkbox" name="showWeekends" id="showWeekends" className={styles.toggleInput}
                            onChange={(e) => {
                                setSettings({ ...settings, ShowWeekends: e.target.checked })
                                console.log(settings.ShowWeekends)
                            }}
                            checked={settings.ShowWeekends}

                        />
                        <label htmlFor="showWeekends" className={styles.toggleLabel}></label>
                    </div>
                </div>

            </div>
        </SettingsLayout>
    )
}
