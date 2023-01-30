import React, { useEffect, useState } from 'react'
import styles from "/styles/calendar.module.scss"
import moment from 'moment';
import Image from 'next/image';

//supabase
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'

//components
import { IconsOnly, TextOnly, RightIconButton } from './buttons';
import Addevent from "/components/addEvent"

//icons
import OneArrowRight from "/public/right.svg"
import TwoArrowRight from "/public/d-right.svg"
import OneArrowLeft from "/public/left.svg"
import TwoArrowLeft from "/public/d-left.svg"
import AddIcon from "/public/AddIcon.svg"

//FullCalendar calendar 
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from '@fullcalendar/daygrid'

//global variable
import { useStateStoreEventsContext } from "/layouts/stateStoreEvents"
import { useStateStoreContext } from "/layouts/stateStore"

export default function Calendar1({ panel, setPanel, toggleValue }) {

    //supabase
    const session = useSession()
    const supabase = useSupabaseClient()
    const user = useUser()

    //global state
    const [eventsPanel, setEventsPanel, input, setinput] = useStateStoreEventsContext()
    const [showSettings, setShowSettings, shortcutsPanel, setShortcutsPanel, settings, setSettings, saveButton, setSaveButton, settingsCopy, setSettingsCopy, warningPanel, setWarningPanel] = useStateStoreContext();

    //variable
    const [weeknumber, setWeeknumber] = useState(0);
    const [title, setTitle] = useState("");
    const [view, setView] = useState("timeGridWeek");
    const [monthViewWeeknumber, setMonthViewWeeknumber] = useState(false)
    const [weatherData, setWeatherData] = useState()
    const [events, setEvents] = useState([]);

    //styles
    const marginLeftStyle = panel ? styles.WithoutMargin : styles.WithMargin;

    //calendar reference
    const calendarComponentRef = React.createRef();

    //lieciesnse key for fullcalendar
    FullCalendar.licenseKey = "GPL-My-Project-Is-Open-Source";


    //################################################################ getevents , select , eventclick , eventchange - start #############
    //convert full date to date and time for the input
    function convertFullDataToDataAndTime(date) {
        const dateWithouthTime = moment(date).format("YYYY-MM-DD");
        const time = moment(date).format("HH:mm");
        return { dateWithouthTime, time }
    }

    //get the list of events from supabase to calendar
    async function getEvents() {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('title', { ascending: true })
            .eq('user_id', user.id)

        if (error) {
            console.log(error)
        }

        else {
            //empty the events array
            setEvents([])
            data.map((item) => {
                setEvents((event) => [...event, {
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    allDay: item.allDay,

                    backgroundColor: item.backgroundColor,
                    icon: item.icon,

                    start: item.allDay ? item.startDate : item.startDate + "T" + item.startTime,
                    end: item.allDay ? item.endDate : item.endDate + "T" + item.endTime,

                    activeRecur: item.activeRecur,
                    daysOfWeek: item.activeRecur ? item.daysOfWeek : null,
                    startTime: item.activeRecur ? item.startTime : null,
                    endTime: item.activeRecur ? item.endTime : null,
                    startRecur: item.activeRecur ? item.startDate : null,
                    endRecur: item.activeRecur ? item.endDate : null,
                }])
            }
            )
        }
    }

    //Show the event panel when the user click on the calendar. (drag and select)
    async function select(event) {

        setEventsPanel(true)
        console.log(event)
        setinput({
            ...input,
            startDate: convertFullDataToDataAndTime(event.start).dateWithouthTime,
            startTime: convertFullDataToDataAndTime(event.startStr).time,
            endDate: convertFullDataToDataAndTime(event.end).dateWithouthTime,
            endTime: convertFullDataToDataAndTime(event.endStr).time,
        })

    }

    //Show the event panel when the user click already existing event.
    async function eventClick(arg) {

        console.log("eventClick" + arg)

        convertFullDataToDataAndTime(arg.event.startStr)
        convertFullDataToDataAndTime(arg.event.endStr)

        setEventsPanel(true)

        console.log(arg)
        console.log("test" + convertFullDataToDataAndTime(arg.event._instance.range.end).dateWithouthTime)

        setinput({
            ...input,
            id: arg.event.id,
            title: arg.event.title,
            description: arg.event.extendedProps.description,
            allDay: arg.event.allDay,

            backgroundColor: arg.event.backgroundColor,
            icon: arg.event.extendedProps.icon,


            startDate: arg.event.extendedProps.activeRecur ? convertFullDataToDataAndTime(arg.event._def.recurringDef.typeData.startRecur).dateWithouthTime : convertFullDataToDataAndTime(arg.event._instance.range.start).dateWithouthTime,
            startTime: convertFullDataToDataAndTime(arg.event.startStr).time,

            endDate: arg.event.extendedProps.activeRecur ? convertFullDataToDataAndTime(arg.event._def.recurringDef.typeData.endRecur).dateWithouthTime : convertFullDataToDataAndTime(arg.event._instance.range.end).dateWithouthTime,
            endTime: convertFullDataToDataAndTime(arg.event.endStr).time,

            activeRecur: arg.event.extendedProps.activeRecur,
            daysOfWeek: arg.event.extendedProps.activeRecur ? arg.event._def.recurringDef.typeData.daysOfWeek : [],
        })
    }

    //event handlers for the calendar change
    async function eventChange(event) {
        console.log(event.event)
        const { data, error } = await supabase
            .from('events')
            .update([
                {
                    allDay: event.event.allDay,
                    startDate: event.event.extendedProps.activeRecur ? convertFullDataToDataAndTime(event.event._def.recurringDef.typeData.startRecur).dateWithouthTime : convertFullDataToDataAndTime(event.event._instance.range.start).dateWithouthTime,
                    startTime: convertFullDataToDataAndTime(event.event.startStr).time,

                    endDate: event.event.extendedProps.activeRecur ? convertFullDataToDataAndTime(event.event._def.recurringDef.typeData.endRecur).dateWithouthTime : convertFullDataToDataAndTime(event.event._instance.range.end).dateWithouthTime,
                    endTime: convertFullDataToDataAndTime(event.event.endStr).time,
                }
            ])
            .eq('id', event.event.id)

        if (error) console.log('error', error)
        else {
            getEvents()
        }
    }

    //################################################################ getevents , select , eventclick , eventchange - end #############


    //############################################################################################# mini functions - start #############
    //next week function
    function nextWeek() {
        const calendarApi = calendarComponentRef.current.getApi();
        calendarApi.next();

        getWeekNumber();
        titleFullCalendar();

    }

    //next two weeks function
    function nextTwoWeeks() {
        const calendarApi = calendarComponentRef.current.getApi();
        calendarApi.next();
        calendarApi.next();

        getWeekNumber();
        titleFullCalendar();

    }

    //previous week function
    function preWeek() {
        const calendarApi = calendarComponentRef.current.getApi();
        calendarApi.prev();
        getWeekNumber();
        titleFullCalendar();


    }

    //previous two weeks function
    function preTwoWeeks() {
        const calendarApi = calendarComponentRef.current.getApi();
        calendarApi.prev();
        calendarApi.prev();
        getWeekNumber();
        titleFullCalendar();

    }

    //today function
    function today() {
        const calendarApi = calendarComponentRef.current.getApi();
        calendarApi.today();

        getWeekNumber();
        titleFullCalendar();

    }

    //Get the week number to show in the clendar
    function getWeekNumber() {
        try {

            const calendarApi = calendarComponentRef.current.getApi();
            let getDate = calendarApi.getDate();
            getDate = new Date(Date.UTC(getDate.getFullYear(), getDate.getMonth(), getDate.getDate()));
            getDate.setUTCDate(getDate.getUTCDate() + 4 - (getDate.getUTCDay() || 7)); //set to nearest thursday
            var yearStart = new Date(Date.UTC(getDate.getUTCFullYear(), 0, 1)); //get the year start
            var weekNo = Math.ceil((((getDate - yearStart) / 86400000) + 1) / 7); //get the week number

            if (weekNo === 53) {
                weekNo = 1;
            }

            setWeeknumber(weekNo);

        } catch (error) {
            console.log(error)
        }
    }

    //get the title of the calendar
    function titleFullCalendar() {
        const calendarApi = calendarComponentRef.current.getApi();
        setTitle(calendarApi.view.title)
    }

    //change view function
    function changeView(event) {
        const calendarApi = calendarComponentRef.current.getApi();
        const view = event.target.value;
        calendarApi.changeView(view);

        getWeekNumber();
        titleFullCalendar();

        if (event.target.value === "dayGridMonth") {
            setMonthViewWeeknumber(true)
        }
        else {
            setMonthViewWeeknumber(false)
        }

    }

    //resize function clendar
    function resizeCalendar() {
        //delay the resize function
        const calendarApi = calendarComponentRef.current.getApi();
        setTimeout(() => {

            calendarApi.updateSize();

        }, 210);
    }

    //function to handle the first day of the week,  monday = 1 , thursday = 2 , sunday = 3 , ...
    function firstDayOfWeek() {
        switch (settings.FirstDayOfTheWeek) {
            case "Monday":
                return 1
            case "Tuesday":
                return 2
            case "Wednesday":
                return 3
            case "Thursday":
                return 4
            case "Friday":
                return 5
            case "Saturday":
                return 6
            case "Sunday":
                return 0
        }
    }
    //############################################################################################# mini functions - end #############

    //######################################################################################### Weather & events - start #############

    //Api call to get the weather data from api/weather, return the data as json
    async function getWeather() {

        const lat1 = settings.latitude.toString().substring(0, 5)
        const lon1 = settings.longitude.toString().substring(0, 5)

        const response = await fetch('api/weather',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    lat: lat1,
                    lon: lon1
                })
            })
        const data = await response.json()

        setWeatherData(data)

    }


    //If weather is checked in the settings, show the weather data in the calendar
    function checkWeather(weatherTemp) {
        if (settings.weather) {
            return (
                <div className={styles.weather}>

                    {/* {weatherTemp?.main.temp === undefined ? "" : */}

                    {<>
                        <div className={styles.temperature}>{

                            Math.round(parseInt(weatherTemp?.main.temp))

                        } °C</div>

                        <div className={styles.weatherIconClase}>
                            <Image
                                src={`https://openweathermap.org/img/wn/${weatherTemp?.weather[0].icon}@2x.png`}
                                alt="weather icon"
                                fill
                            />
                        </div>
                    </>
                    }

                </div>
            )
        }

        else {
            return ""
        }
    }


    //Today date using moment.js withouth time zone
    const startDate = moment().format("YYYY-MM-DD")

    //Add 4 days to today date
    const endDate = moment().add(5, 'days').format("YYYY-MM-DD")


    //Function to show and control the day header in the calendar. to add the weather data and icons to it.
    function dayHeaderContent(arg) {

        const dateToCompare = moment(arg.date)
        const isBetweenDates = dateToCompare.isBetween(startDate, endDate, null, '[]');

        if (isBetweenDates) {

            //Find the weather data for the current date
            const weatherTemp = weatherData?.list?.find(
                (item) => item.dt_txt.includes(moment(arg.date).format('YYYY-MM-DD'))
            )

            return (

                <div className={styles.dayHeader}>
                    <div className={styles.dayHeaderSundayText}>

                        {/* Convert ma to MAN and so to SUN ... */}
                        {arg.date.getDay() === 0 ? <div className={`${styles.dayName} ${styles.red}`}>SUN</div> : null}
                        {arg.date.getDay() === 1 ? <div className={styles.dayName}>MON</div> : null}
                        {arg.date.getDay() === 2 ? <div className={styles.dayName}>TUE</div> : null}
                        {arg.date.getDay() === 3 ? <div className={styles.dayName}>WED</div> : null}
                        {arg.date.getDay() === 4 ? <div className={styles.dayName}>THU</div> : null}
                        {arg.date.getDay() === 5 ? <div className={styles.dayName}>FRI</div> : null}
                        {arg.date.getDay() === 6 ? <div className={styles.dayName}>SAT</div> : null}

                        {/* Do not show the day number and the weather data in the month view */}
                        {
                            monthViewWeeknumber ? null :
                                <>
                                    <div className={styles.daydate}> {arg.date.getDate()} </div>
                                    {checkWeather(weatherTemp)}
                                </>
                        }

                    </div>
                </div >

            )
        }

        else {
            return (
                <div className={styles.dayHeader}>

                    <div className={styles.dayHeaderSundayText}>

                        {/* Convert ma to MAN and so to SUN ... */}
                        {arg.date.getDay() === 0 ? <div className={`${styles.dayName} ${styles.red}`}>SUN</div> : null}
                        {arg.date.getDay() === 1 ? <div className={styles.dayName}>MON</div> : null}
                        {arg.date.getDay() === 2 ? <div className={styles.dayName}>TUE</div> : null}
                        {arg.date.getDay() === 3 ? <div className={styles.dayName}>WED</div> : null}
                        {arg.date.getDay() === 4 ? <div className={styles.dayName}>THU</div> : null}
                        {arg.date.getDay() === 5 ? <div className={styles.dayName}>FRI</div> : null}
                        {arg.date.getDay() === 6 ? <div className={styles.dayName}>SAT</div> : null}

                        {/* Do not show the day number and the weather data in the month view */}
                        {
                            monthViewWeeknumber ? null :
                                <div className={styles.daydate}>{arg.date.getDate()}</div>

                        }

                    </div>

                </div >
            )
        }
    }

    //Function to show the events in the calendar 
    function eventContent(arg) {
        return (
            <div className={styles.eventContent}>

                <div className={styles.eventContentTime}>
                    {arg.timeText}
                </div>

                <div className={styles.eventContentTitle}>
                    {arg.event.title}
                </div>

                {
                    arg.event.extendedProps.icon && (
                        <div className={styles.evenIconHolder}>

                            <div className={styles.eventIcon}>

                                <Image
                                    src={arg.event.extendedProps.icon}
                                    alt="icon"
                                    fill
                                />
                            </div>

                        </div>
                    )
                }

            </div>

        )
    }

    //############################################################################################## Weather & events - end #############


    //################################################################################################### useEffect - start #############

    // resize the calendar when the toggleValue changes (side panel open/close)
    useEffect(() => {

        resizeCalendar()

    }, [toggleValue])


    // get the weather data when the latitude or longitude changes
    useEffect(() => {

        getWeather()

    }, [settings.latitude, settings.longitude])


    // get the events when the eventsPanel changes (open/close)
    useEffect(() => {

        if (eventsPanel === false) {
            setTimeout(() => {
                getEvents()
            }, 100)
        }

    }, [eventsPanel])


    //Run the functions when loading the page once
    useEffect(() => {

        getEvents()
        getWeekNumber();
        titleFullCalendar();


    }, [])

    //################################################################################################### useEffect - end #############


    return (
        <>
            <div className={`${styles.buttonTools} ${marginLeftStyle}`}>

                {/* Create event button */}
                <RightIconButton
                    icon={<AddIcon />}
                    text="Create"
                    onClick={
                        () => {
                            setEventsPanel(true)
                        }
                    } />

                {/* Addevent is a component that contains the form to create a new event  */}
                <Addevent />

                {/* Options to change the view of the calendar */}
                <select onChange={changeView} className={styles.select}>
                    <option value="timeGridWeek" defaultValue>Week</option>
                    <option value="timeGridDay" >Day</option>
                    <option value="dayGridMonth">Month</option>
                </select>

                {/* Today date and week number*/}
                <div className={styles.bigDate}>{title}</div>
                <div className={styles.weekNumber}>Week {weeknumber}</div>

                {/* navigation buttons  */}
                <div className={styles.toolbarNavigationButton}>

                    <IconsOnly icon={<TwoArrowLeft />} onClick={preTwoWeeks} />
                    <IconsOnly icon={<OneArrowLeft />} onClick={preWeek} />
                    <TextOnly text="Today" onClick={today} />
                    <IconsOnly icon={<OneArrowRight />} onClick={nextWeek} />
                    <IconsOnly icon={<TwoArrowRight />} onClick={nextTwoWeeks} />

                </div>

            </div>

            {/* The calendar */}
            <FullCalendar
                plugins={[
                    timeGridPlugin,
                    interactionPlugin,
                    dayGridPlugin,
                ]}

                height="89%"
                eventBackgroundColor="#4c7987"
                eventBorderColor="#ffffff00"
                headerToolbar={false}
                weekNumbers={false}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                handleWindowResize={true} //resize the calendar when the window is resized
                initialView={view} //the view of the calendar, default is week
                ref={calendarComponentRef} //reference to the calendar
                weekends={settings.ShowWeekends} //show weekends
                firstDay={firstDayOfWeek()} //first day of the week
                longPressDelay={1000} //long press delay to drag and drop
                slotMinTime={settings.BeginTimeDay} //start time of the day
                slotMaxTime={settings.EndTimeDay} //end time of the day
                timeZone="local" //timezone
                nowIndicator={true} //show the current time indicator

                //custom classes
                viewClassNames={styles.moreLinkClassNames}
                dayHeaderClassNames={`${styles.dayHeaderClassNames}`}
                eventClassNames={styles.eventClassNames}

                //custom events
                select={
                    function (arg) {
                        select(arg);
                    }
                }

                //custom event click
                eventClick={
                    function (arg) {
                        eventClick(arg)
                    }
                }

                //custom event change (drag and drop)
                eventChange={
                    function (arg) {
                        eventChange(arg)
                    }
                }

                navLinkDayClick={
                    function (arg) {
                        navLinkDayClick(arg)
                    }
                }

                //custom event content and styles (time, title, icon)
                eventContent={
                    function (arg) {
                        if (monthViewWeeknumber === false) {
                            return eventContent(arg)
                        }
                    }
                }

                //custom header content and styles (weathers, day name, day date)
                dayHeaderContent={
                    function (arg) {
                        return dayHeaderContent(arg)
                    }
                }

                // Events to show in the calendar
                events={
                    events
                }
            />
        </>
    )
}