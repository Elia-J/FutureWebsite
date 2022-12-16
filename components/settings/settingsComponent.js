import React, { useEffect, useState } from 'react'
import styles from "/styles/settingsComponent.module.scss"

//components
import ButtonWithIcon from '../buttons'
import AccountSetting from '/components/settings/Account'
import GeneralSetting from '/components/settings/General'

//icons
import CloseIcon from "/public/close.svg"
import Account from "/public/Profile.svg"
import General from "/public/Settings.svg"

//global state
import { useSettingsContext } from "/layouts/stateStore"

export default function Setting() {

    const [account, setAccount] = useState(true);
    const [general, setGeneral] = useState(false);
    const [tasksSettings, setTasksSettings] = useState(false);
    const [calendarSettings, setCalendarSettings] = useState(false);
    const [notesSettings, setNotesSettings] = useState(false);
    const [ai, setAi] = useState(false);

    const [showSettings, setShowSettings] = useSettingsContext();
    const [data, setData] = useState();

    //handle account, show account settings
    const handleAccount = () => {

        setAccount(true);
        setGeneral(false);
        setTasksSettings(false);
        setCalendarSettings(false);
        setNotesSettings(false);
        setAi(false);

    }

    //handle general, show general settings
    const handleGeneral = () => {

        setAccount(false);
        setGeneral(true);
        setTasksSettings(false);
        setCalendarSettings(false);
        setNotesSettings(false);
        setAi(false);

    }

    //if general is true, show general settings, if account is true, show account settings
    useEffect(() => {

        if (account) {
            setData(<AccountSetting />)
        }
        if (general) {
            setData(<GeneralSetting />)
        }

    }, [account])


    return (
        <div className={styles.panel}>
            <div className={styles.scrole}>

                <button className={styles.closeButton} onClick={() => { setShowSettings(false) }}>
                    <CloseIcon />
                </button>

                <div className={styles.leftPanel}>

                    <h2 className={styles.title}>Setting</h2>
                    <div className={styles.buttonContainer}>

                        <div className={styles.buttonsHolder}>

                            <ButtonWithIcon icon={<Account />} text="Account" onClick={handleAccount} active={account} />
                            <ButtonWithIcon icon={<General />} text="General" onClick={handleGeneral} active={general} />

                        </div>

                    </div>

                </div>

                <div className={styles.rightPanel} >
                    {data}
                </div>

            </div>
        </div>
    )
}

