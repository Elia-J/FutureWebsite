import React, { useEffect, useState } from 'react'
import styles from "/styles/settingsComponent.module.scss"

//components
import ButtonWithIcon from '../buttons'

//settings
import AccountSettings from '/components/settings/Account'
import GeneralSettings from '/components/settings/General'
import CalendarSettings from '/components/settings/CalendarSetting'
import WeatherSettings from '/components/settings/weatherSettings'
import TasksSetting from '/components/settings/TasksSetting'

//icons
import CloseIcon from "/public/close.svg"
import Account from "/public/Profile.svg"
import General from "/public/Settings.svg"
import Calendar from "/public/Calendar.svg"
import Tasks from "/public/Tasks.svg"
import Weather from "/public/Weather.svg"

//global state
import { useStateStoreContext } from "/layouts/stateStore"

//supabase
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'

//theme
import { useTheme } from 'next-themes'

//toast
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router'


export default function Setting() {

    //supabase
    const supabase = useSupabaseClient()
    const session = useSession()
    const user = useUser()

    const router = useRouter()

    //global state/variables
    const [showSettings, setShowSettings, shortcutsPanel, setShortcutsPanel, settings, setSettings, saveButton, setSaveButton, settingsCopy, setSettingsCopy, warningPanel, setWarningPanel] = useStateStoreContext();
    const { theme, setTheme } = useTheme()

    //variables
    const [account, setAccount] = useState(true);
    const [general, setGeneral] = useState(false);
    const [calendarSettings, setCalendarSettings] = useState(false);
    const [weatherSettings, setWeatherSettings] = useState(false);
    const [tasksSettings, setTasksSettings] = useState(false);

    //warning panel settings
    const warningPanelStyle = warningPanel.show ? `${styles.warningPanel} ${styles.warningPanelOpen}` : `${styles.warningPanel} ${styles.warningPanelClose}`


    const [isLoading, setIsLoading] = useState(false);
    // const [imageUrl, setImageUrl] = useState("")


    //Get data from database
    async function GetProfileData() {
        setIsLoading(true)

        const { data, error } = await supabase
            .from('profiles')
            .select(`*`)
            .eq('id', user.id)

        if (error) {
            console.log(error)
            setIsLoading(false)
        }

        if (data) {
            setIsLoading(false)

            let imageUrl = "/pro.png"

            if (data[0].avatar_url == "/pro.png" || data[0].avatar_url == null || data[0].avatar_url == "") {
                imageUrl = "/pro.png"
            }
            else if (data[0].avatar_url.substring(0, 4) == "http") {
                imageUrl = data[0].avatar_url
            }
            else {
                const { data: data2, error: error2 } = await supabase.storage
                    .from('avatars')
                    .download(data[0].avatar_url)

                if (error2) {
                    console.log(error)
                }
                imageUrl = URL.createObjectURL(data2)
            }


            const dataFromDatabase = {
                //variable name : name in data
                FullName: data[0].full_name,
                UserName: data[0].username,
                Website: data[0].website,
                Theme: data[0].mode,
                syncTheme: data[0].syncTheme,
                FirstDayOfTheWeek: data[0].firstDayOfWeek,
                time_zone: data[0].time_zone,
                BeginTimeDay: data[0].BeginTimeDay,
                EndTimeDay: data[0].EndTimeDay,
                ShowWeekends: data[0].ShowWeekends,
                avatar_url: imageUrl,
                filepath: data[0].avatar_url,

                //weather
                weather: data[0].weather,
                country_name: data[0].country_name,
                iso_ode: data[0].iso_ode,
                city_name: data[0].city_name,
                latitude: data[0].latitude,
                longitude: data[0].longitude,

                //tasks
                removeCheckedTasks: data[0].removeCheckedTasks,
                showTimeForTasks: data[0].showTimeForTasks,
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
                avatar_url: settings.filepath,
                time_zone: settings.time_zone,
                BeginTimeDay: settings.BeginTimeDay,
                EndTimeDay: settings.EndTimeDay,
                ShowWeekends: settings.ShowWeekends,
                avatar_url: settings.filepath,

                //waether
                weather: settings.weather,
                country_name: settings.country_name,
                iso_ode: settings.iso_ode,
                city_name: settings.city_name,
                latitude: settings.latitude,
                longitude: settings.longitude,

                //tasks
                showTimeForTasks: settings.showTimeForTasks,
                removeCheckedTasks: settings.removeCheckedTasks,

            })
            .eq('id', user.id)

        if (error) {
            console.log(error)
        }

    }

    //compare two lists of useStatuses and return true if they are different
    function compareSettings() {
        if (JSON.stringify(settings) !== JSON.stringify(settingsCopy)) {
            setSaveButton(true)
        } else {
            setSaveButton(false)
        }
    }

    //handleDeleteAccount
    async function handleDeleteAccount() {

        const { error: errorPic, data: dataPic } = await supabase.storage
            .from('avatars')
            .remove([`${user.id}.jpg`, `${user.id}.png`, `${user.id}.jpeg`, `${user.id}.gif`, `${user.id}.webp`, `${user.id}.svg`, `${user.id}.jfif`, `${user.id}.bmp`, `${user.id}.tiff`, `${user.id}.ico`, `${user.id}.webp`])


        const { data, error } = await supabase.auth.getSession()
        if (error) {
            console.log(error)
        }
        else {
            const responses = await fetch('/api/deleteUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_token: data.session.access_token
                }),
            })

            const response = await responses.json()

            if (response.error) {
                toast.error(response.error)
            }
            else if (response.message === "User deleted") {
                toast.success(
                    'Account deleted', {
                    iconTheme: {
                        primary: '#4C7987',
                        secondary: '#ffffff',
                    }
                })
                router.push('/')
                //sign out the user
                const { error } = await supabase.auth.signOut()
            }
        }
    }

    //check the password and delete the account
    async function checkSentence(e) {

        e.preventDefault()

        if (warningPanel.sentenceCheck === "delete my account") {
            handleDeleteAccount()
        }

        else {
            toast.error('Please type the sentence correctly')
        }
    }

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
        setWeatherSettings(false);
        setTasksSettings(false);

    }

    //handle general, show general settings
    const handleGeneral = () => {

        setAccount(false);
        setGeneral(true);
        setCalendarSettings(false);
        setWeatherSettings(false);
        setTasksSettings(false);


    }

    //handle calendar, show calendar settings
    const handleCalendar = () => {

        setAccount(false);
        setGeneral(false);
        setCalendarSettings(true);
        setWeatherSettings(false);
        setTasksSettings(false);

    }

    //handle tasks, show tasks settings
    const handleTasks = () => {

        setAccount(false);
        setGeneral(false);
        setCalendarSettings(false);
        setWeatherSettings(false);
        setTasksSettings(true);

    }

    //handle WeatherSettings, show WeatherSettings
    const handleWeather = () => {

        setAccount(false);
        setGeneral(false);
        setCalendarSettings(false);
        setWeatherSettings(true);
        setTasksSettings(false);

    }


    //if general is true, show general settings, if account is true, show account settings
    useEffect(() => {

        if (account) {
            setData(<AccountSettings />)
        }
        if (general) {
            setData(<GeneralSettings />)
        }
        if (calendarSettings) {
            setData(<CalendarSettings />)
        }
        if (weatherSettings) {
            setData(<WeatherSettings />)
        }
        if (tasksSettings) {
            setData(<TasksSetting />)
        }

    }, [account, general, calendarSettings, weatherSettings, tasksSettings])


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
                            <ButtonWithIcon icon={<Weather />} text="Weather" onClick={handleWeather} active={weatherSettings} />
                            <ButtonWithIcon icon={<Tasks />} text="Tasks" onClick={handleTasks} active={tasksSettings} />
                        </div>

                    </div>

                </div>

                <div className={styles.rightPanel} >
                    {data}
                </div>

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

                {/* delete account */}
                <div className={warningPanelStyle} >
                    <div className={styles.warningBox}>
                        <div className={styles.topSection}>
                            <div className={styles.warningTitle}>Delete Account</div>
                            <button className={styles.closeButton} onClick={() => {
                                setWarningPanel({
                                    ...warningPanel,
                                    show: false,
                                    sentenceCheck: ""
                                })
                            }}>
                                <CloseIcon />
                            </button>
                        </div>
                        <p className={styles.warningText}>
                            To confirm the deletion of your account, please type <b>&#34;delete my account&#34;</b> in the box below. We understand that this is a big decision and it can&#39;t be undone once done. We want to ensure that you are completely certain before proceeding with the deletion.
                        </p>
                        <form className={styles.inputArea} onSubmit={checkSentence}>

                            <input
                                id="text"
                                type="text"
                                value={warningPanel.sentenceCheck}
                                placeholder="Type 'delete my account' to confirm"
                                onChange={(e) => setWarningPanel({ ...warningPanel, sentenceCheck: e.target.value })}
                                className={styles.input}
                                required
                                autoComplete="off"
                            />
                            <button className={styles.deleteButton} type="submit">Delete</button>

                        </form>
                    </div>

                    <div className={styles.bg} onClick={() => {
                        setWarningPanel(
                            {
                                ...settings,
                                show: false,
                                sentenceCheck: ""
                            }
                        )
                    }}></div>
                </div>


                <Toaster position="bottom-right" reverseOrder={false} />
            </div>



        </div>
    )
}
