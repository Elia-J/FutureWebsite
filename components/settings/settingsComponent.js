import React, { useEffect, useState } from 'react'
import styles from "/styles/settingsComponent.module.scss"

//components
import ButtonWithIcon from '../buttons'

//settings
import AccountSettings from '/components/settings/Account'
import GeneralSettings from '/components/settings/General'
import CalendarSettings from '/components/settings/CalendarSetting'
import WeatherSettings from '/components/settings/weatherSettings'

//icons
import CloseIcon from "/public/close.svg"
import Account from "/public/Profile.svg"
import General from "/public/Settings.svg"
import Calendar from "/public/Calendar.svg"
import Weather from "/public/Weather.svg"

//global state
import { useStateStoreContext } from "/layouts/stateStore"

//supabase
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'

//theme
import { useTheme } from 'next-themes'

//toast
import toast, { Toaster } from 'react-hot-toast';


export default function Setting() {

    //supabase
    const supabase = useSupabaseClient()
    const session = useSession()
    const user = useUser()


    //global state/variables
    const [showSettings, setShowSettings, shortcutsPanel, setShortcutsPanel, settings, setSettings, saveButton, setSaveButton, settingsCopy, setSettingsCopy, warningPanel, setWarningPanel] = useStateStoreContext();
    const { theme, setTheme } = useTheme()

    //variables
    const [account, setAccount] = useState(true);
    const [general, setGeneral] = useState(false);
    const [calendarSettings, setCalendarSettings] = useState(false);
    const [weatherSettings, setWeatherSettings] = useState(false);

    //warning panel settings
    const warningPanelStyle = warningPanel.show ? `${styles.warningPanel} ${styles.warningPanelOpen}` : `${styles.warningPanel} ${styles.warningPanelClose}`


    const [tasksSettings, setTasksSettings] = useState(false);
    const [notesSettings, setNotesSettings] = useState(false);
    const [ai, setAi] = useState(false);
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

            let imageUrl = ""

            if (data[0].avatar_url == "/pro.png" || data[0].avatar_url == null) {
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

                //weather
                weather: data[0].weather,
                country_name: data[0].country_name,
                iso_ode: data[0].iso_ode,
                city_name: data[0].city_name,
                latitude: data[0].latitude,
                longitude: data[0].longitude,
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


    //handleDeleteAccount
    async function handleDeleteAccount() {

        const { data, error } = await supabase.auth.getSession()

        if (error) {
            console.log(error)
        }

        else {

            //make a request to the api/deleteUser route with body of the user id
            const response = await ('/api/deleteUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        access_token: data.session.access_token
                    }
                ),
            })

            //console log the response message
            const responseMessage = await response.json()

            if (responseMessage.message === "User deleted") {
                toast.success('Account deleted', {
                    iconTheme: {
                        primary: '#4C7987',
                        secondary: '#ffffff',
                    }
                });

                //sign out the user
                const { error } = await supabase.auth.signOut()
                if (error) {
                    console.log(error)
                }
                else {
                    //redirect to the home page
                    router.push("/")
                }
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
        setNotesSettings(false);
        setAi(false);

    }

    //handle general, show general settings
    const handleGeneral = () => {

        setAccount(false);
        setGeneral(true);
        setCalendarSettings(false);
        setWeatherSettings(false);

        setTasksSettings(false);
        setNotesSettings(false);
        setAi(false);

    }

    //handle calendar, show calendar settings
    const handleCalendar = () => {

        setAccount(false);
        setGeneral(false);
        setCalendarSettings(true);
        setWeatherSettings(false);

        setTasksSettings(false);
        setNotesSettings(false);
        setAi(false);
    }

    //handle WeatherSettings, show WeatherSettings
    const handleWeather = () => {
        setAccount(false);
        setGeneral(false);
        setCalendarSettings(false);
        setWeatherSettings(true);

        setTasksSettings(false);
        setNotesSettings(false);
        setAi(false);
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

    }, [account, general, calendarSettings, weatherSettings])


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

                    <Toaster position="bottom-right" reverseOrder={false} />


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

