import React from 'react'
import SettingsLayout from '../../layouts/settingsLayout'
import styles from '/styles/general.module.scss'
import { useStateStoreContext } from "/layouts/stateStore"

export default function CalendarSetting() {

    const dayOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    const [showSettings, setShowSettings, shortcutsPanel, setShortcutsPanel, settings, setSettings, saveButton, setSaveButton, settingsCopy, setSettingsCopy] = useStateStoreContext();
    console.log("show weekends " + settings.ShowWeekends)


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
                    <label htmlFor="beginTimeDay">Min</label>
                    <input type="time" name="beginTimeDay" id="beginTimeDay" className={styles.timeInput}
                        onChange={(e) => {
                            setSettings({ ...settings, BeginTimeDay: e.target.value })
                        }}
                        value={settings.BeginTimeDay}

                    />
                    <label htmlFor="endTimeDay">Max</label>
                    <input type="time" name="endTimeDay" id="endTimeDay" className={styles.timeInput}
                        onChange={(e) => {
                            setSettings({ ...settings, EndTimeDay: e.target.value })
                        }}
                        value={settings.EndTimeDay}
                    />

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
