import React from 'react'
import SettingsLayout from '../../layouts/settingsLayout'
import styles from '/styles/general.module.scss'
import { useStateStoreContext } from "/layouts/stateStore"

export default function TasksSetting() {
    
    const [showSettings, setShowSettings, shortcutsPanel, setShortcutsPanel, settings, setSettings, saveButton, setSaveButton, settingsCopy, setSettingsCopy] = useStateStoreContext();

    return (
        <SettingsLayout title="Tasks">
            <div className={styles.optionsVertical}>
                <div className={styles.details}>
                    <div className={styles.minititle}>Automatically removing checked tasks</div>
                    <div className={styles.discription}>
                        Choose whether to automatically remove tasks when you check them
                    </div>
                </div>
                <div className={styles.timeLimit}>
                    <div className={styles.toggleContainer}>
                        <input type="checkbox" name="removeCheckedTasks" id="removeCheckedTasks" className={styles.toggleInput}
                            onChange={(e) => {
                                setSettings({ ...settings, removeCheckedTasks: e.target.checked })
                                console.log(settings.removeCheckedTasks)
                            }}
                            checked={settings.removeCheckedTasks}
                        />
                        <label htmlFor="removeCheckedTasks" className={styles.toggleLabel}></label>
                    </div>
                </div>
            </div>

            <div className={styles.optionsVertical}>
                <div className={styles.details}>
                    <div className={styles.minititle}>Show time for tasks</div>
                    <div className={styles.discription}>
                        Show the time for tasks instead of the date
                    </div>
                </div>
                <div className={styles.timeLimit}>
                    <div className={styles.toggleContainer}>
                        <input type="checkbox" name="showTimeForTasks" id="showTimeForTasks" className={styles.toggleInput}
                            onChange={(e) => {
                                setSettings({ ...settings, showTimeForTasks: e.target.checked })
                                console.log(settings.showTimeForTasks)
                            }}
                            checked={settings.showTimeForTasks}
                        />
                        <label htmlFor="showTimeForTasks" className={styles.toggleLabel}></label>
                    </div>
                </div>
            </div>
        </SettingsLayout>
    )
}
