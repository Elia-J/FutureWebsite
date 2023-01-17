import React, { useEffect, useState } from 'react'
import styles from "/styles/settingsComponent.module.scss"

//components
import ButtonWithIcon from '../buttons'
import AccountSetting from '/components/settings/Account'
import GeneralSetting from '/components/settings/General'
import CalendarSetting from '/components/settings/CalendarSetting'

//icons
import CloseIcon from "/public/close.svg"
import Account from "/public/Profile.svg"
import General from "/public/Settings.svg"
import Calendar from "/public/Calendar.svg"

//global state
import { useStateStoreContext } from "/layouts/stateStore"

//supabase
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'

//theme
import { useTheme } from 'next-themes'

//toast
import toast, { Toaster } from 'react-hot-toast';


export default function Setting() {

    const supabase = useSupabaseClient()
    const session = useSession()
    const user = useUser()

    const [account, setAccount] = useState(true);
    const [general, setGeneral] = useState(false);
    const [tasksSettings, setTasksSettings] = useState(false);
    const [calendarSettings, setCalendarSettings] = useState(false);
    const [notesSettings, setNotesSettings] = useState(false);
    const [ai, setAi] = useState(false);

    const [showSettings, setShowSettings, shortcutsPanel, setShortcutsPanel, settings, setSettings, saveButton, setSaveButton, settingsCopy, setSettingsCopy] = useStateStoreContext();
    const { theme, setTheme } = useTheme()


    const [loading, setLoading] = useState(false)

    //Get data from database
    async function GetProfileData() {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('profiles')
                .select(`*`)
                .eq('id', user.id)

            if (data) {
                const dataFromDatabase = {
                    //variable name : name in data
                    FullName: data[0].full_name,
                    UserName: data[0].username,
                    Website: data[0].website,
                    Theme: data[0].mode,
                    syncTheme: data[0].syncTheme,
                    FirstDayOfTheWeek: data[0].firstDayOfWeek,
                    TimeZone: data[0].timeZone,
                    BeginTimeDay: data[0].BeginTimeDay,
                    EndTimeDay: data[0].EndTimeDay,
                    ShowWeekends: data[0].ShowWeekends,
                    avatar_url: data[0].avatar_url
                }

                setSettings(
                    {
                        ...settings,
                        ...dataFromDatabase
                    }
                )
                setSettingsCopy(
                    {
                        ...settings,
                        ...settingsCopy,
                        ...dataFromDatabase
                    }
                )

                //set theme
                if (data[0].syncTheme && data[0].mode != theme) {
                    setTheme(data[0].mode)
                }



            }
        } catch (err) {
            console.log(err)
        }
        finally {
            setLoading(false)
        }
    }

    function handleURL() {
        if (settings.avatar_url.includes("https") == false) {
            downloadTheAvatar(settings.avatar_url)
        }
    }

    async function downloadTheAvatar(avatarUrl) {

        try {
            const { data, error } = await supabase.storage
                .from('avatars')
                .download(avatarUrl)

            // create a url for the file object to display in the browser
            const url2 = URL.createObjectURL(data)
            setSettings(
                {
                    ...settings,
                    profileImageUrl: url2
                }
            )
            setSettingsCopy(
                {
                    ...settings,
                    ...settingsCopy,
                    profileImageUrl: url2
                }
            )

        } catch (error) {
            console.log(error)
        }
    }

    // update data in database
    async function updateData() {

        const { data, error } = await supabase
            .from('profiles')
            .update({
                //Name in data  : variable name 
                full_name: settings.FullName,
                username: settings.UserName,
                website: settings.Website,
                mode: settings.Theme,
                syncTheme: settings.syncTheme,
                firstDayOfWeek: settings.FirstDayOfTheWeek,
                timeZone: settings.TimeZone,
                BeginTimeDay: settings.BeginTimeDay,
                EndTimeDay: settings.EndTimeDay,
                ShowWeekends: settings.ShowWeekends,
                avatar_url: settings.filepath
            })
            .eq('id', user.id)

        if (error) {
            console.log(error)
        }

    }

    // console.log("settings " + JSON.stringify(settings))
    // console.log("settingsCopy " + JSON.stringify(settingsCopy))
    //compare two lists of useStatuses and return true if they are different
    function compareSettings() {
        if (JSON.stringify(settings) !== JSON.stringify(settingsCopy)) {
            setSaveButton(true)
        } else {
            setSaveButton(false)
        }

    }

    useEffect(() => {
        handleURL()
    }, [settings.avatar_url])


    useEffect(() => {
        compareSettings()
    }, [settings])


    useEffect(() => {
        GetProfileData()
    }, [])


    const [data, setData] = useState();

    //handle account, show account settings
    const handleAccount = () => {

        setAccount(true);
        setGeneral(false);
        setCalendarSettings(false);
        setTasksSettings(false);
        setNotesSettings(false);
        setAi(false);

    }

    //handle general, show general settings
    const handleGeneral = () => {

        setAccount(false);
        setGeneral(true);
        setCalendarSettings(false);
        setTasksSettings(false);
        setNotesSettings(false);
        setAi(false);

    }

    //handle calendar, show calendar settings
    const handleCalendar = () => {

        setAccount(false);
        setGeneral(false);
        setCalendarSettings(true);
        setTasksSettings(false);
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
        if (calendarSettings) {
            setData(<CalendarSetting />)
        }

    }, [account, general, calendarSettings])


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
                            <ButtonWithIcon icon={<Calendar />} text="Calendar" onClick={handleCalendar} active={calendarSettings} />

                        </div>

                    </div>

                </div>



                <div className={styles.rightPanel} >
                    {data}

                    {saveButton ?

                        <div className={styles.savaAndCancelButtons}>
                            <button className={`${styles.cancelButton} ${styles.buttong}`}
                                onClick={
                                    () => {
                                        setSettings(settingsCopy)
                                        setSaveButton(false)
                                    }
                                }

                            >Cancel</button>
                            <button className={`${styles.saveButton} ${styles.buttong}`}
                                onClick={
                                    () => {
                                        updateData()
                                        setSettingsCopy(settings)
                                        setSaveButton(false)
                                    }
                                }
                            >Save
                            </button>


                        </div>



                        : null}
                </div>

                <Toaster position="bottom-right" reverseOrder={false} />
            </div>

        </div>
    )
}

