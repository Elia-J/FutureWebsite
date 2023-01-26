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

//calendar
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid'
import momentTimezonePlugin from '@fullcalendar/moment-timezone'


//global variable
import { useStateStoreEventsContext } from "/layouts/stateStoreEvents"
import { useStateStoreContext } from "/layouts/stateStore"

export default function Calendar1({ panel, setPanel, toggleValue }) {

    //supabase
    const session = useSession()
    const supabase = useSupabaseClient()
    const user = useUser()

    //moment
    const momentTimezone = require('moment-timezone');
    const momentWithoutTimezone = require('moment');

    //global state
    const [eventsPanel, setEventsPanel, input, setinput] = useStateStoreEventsContext()
    const [showSettings, setShowSettings, shortcutsPanel, setShortcutsPanel, settings, setSettings, saveButton, setSaveButton, settingsCopy, setSettingsCopy, warningPanel, setWarningPanel] = useStateStoreContext();

    //variable
    const [weeknumber, setWeeknumber] = useState(0);
    const [title, setTitle] = useState("");
    const [view, setView] = useState("timeGridWeek");
    const [monthViewWeeknumber, setMonthViewWeeknumber] = useState(false)

    const [events, setEvents] = useState([]);


    //styles
    const marginLeftStyle = panel ? styles.WithoutMargin : styles.WithMargin;

    //calendar reference
    const calendarComponentRef = React.createRef();

    //lieciesnse key for fullcalendar
    FullCalendar.licenseKey = "GPL-My-Project-Is-Open-Source";


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
                    start: item.beginDate,
                    end: item.endDate,
                    backgroundColor: item.backgroundColor,
                    icon: item.icon,
                    daysOfWeek: item.daysOfWeek,
                    startRecur: item.startRecur,
                    endRecur: item.endRecur,
                    startTime: item.startTime,
                    endTime: item.endTime,
                }])
            }
            )



        }
    }

    function convertFullDataToDataAndTime(date) {
        const dateWithouthTime = moment(date).format("YYYY-MM-DD");
        const time = moment(date).format("HH:mm:ss");
        return { dateWithouthTime, time }
    }

    // add event to the database
    async function select(event) {

        setEventsPanel(true)
        setinput({
            ...input,
            startDate: convertFullDataToDataAndTime(event.startStr).dateWithouthTime,
            startTime: convertFullDataToDataAndTime(event.startStr).time,
            endDate: convertFullDataToDataAndTime(event.endStr).dateWithouthTime,
            endTime: convertFullDataToDataAndTime(event.endStr).time,
        })

    }

    //add event to the database
    async function eventClick(arg) {

        console.log(arg)

        convertFullDataToDataAndTime(arg.event.startStr)
        convertFullDataToDataAndTime(arg.event.endStr)

        setEventsPanel(true)
        setinput({
            ...input,
            id: arg.event.id,
            title: arg.event.title,
            startDate: convertFullDataToDataAndTime(arg.event.startStr).dateWithouthTime,
            startTime: convertFullDataToDataAndTime(arg.event.startStr).time,
            endDate: convertFullDataToDataAndTime(arg.event.endStr).dateWithouthTime,
            endTime: convertFullDataToDataAndTime(arg.event.endStr).time,
            backgroundColor: arg.event.backgroundColor,
            icon: arg.event.extendedProps.icon,
            daysOfWeek: arg.event._def.recurringDef?.typeData?.daysOfWeek ? arg.event._def.recurringDef.typeData.daysOfWeek : [],
        })

    }

    //event handlers for the calendar change
    async function eventChange(event) {
        const { data, error } = await supabase
            .from('events')
            .update([
                {
                    id: event.event.id,
                    title: event.event.title,
                    beginDate: event.event.startStr,
                    endDate: event.event.endStr,
                }
            ])
            .eq('id', event.event.id)

        if (error) console.log('error', error)
        else {
            getEvents()
        }
    }




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

    //get week number
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


    const [weatherData, setWeatherData] = useState()

    //Api call to get the weather data
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

    //Today date
    const today2 = momentTimezone.tz(settings.time_zone).format('DD-MM-YYYY');

    //Add 4 days to today date
    const today3 = momentTimezone.tz(settings.time_zone).add(4, 'days').format('DD-MM-YYYY');

    function checkWeather(weatherTemp) {
        if (settings.weather) {
            return (
                <div className={styles.weather}>

                    {weatherTemp?.main.temp === undefined ? "" :
                        <>
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

    function dayHeaderContent(arg) {

        const date = moment(arg.date).format('DD-MM-YYYY');

        if (date >= today2 && date <= today3) {

            const weatherTemp = weatherData?.list?.find(
                (item) => item.dt_txt.includes(moment(arg.date).format('YYYY-MM-DD'))
            )
            return (

                <div className={styles.dayHeader}>
                    <div className={styles.dayHeaderSundayText}>

                        {arg.date.getDay() === 0 ? <div className={`${styles.dayName} ${styles.red}`}>SUN</div> : null}
                        {arg.date.getDay() === 1 ? <div className={styles.dayName}>MON</div> : null}
                        {arg.date.getDay() === 2 ? <div className={styles.dayName}>TUE</div> : null}
                        {arg.date.getDay() === 3 ? <div className={styles.dayName}>WED</div> : null}
                        {arg.date.getDay() === 4 ? <div className={styles.dayName}>THU</div> : null}
                        {arg.date.getDay() === 5 ? <div className={styles.dayName}>FRI</div> : null}
                        {arg.date.getDay() === 6 ? <div className={styles.dayName}>SAT</div> : null}

                        {
                            monthViewWeeknumber ?

                                null

                                :

                                <>
                                    <div className={styles.daydate}>
                                        {arg.date.getDate()}
                                    </div>
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
                        {arg.date.getDay() === 0 ? <div className={`${styles.dayName} ${styles.red}`}>SUN</div> : null}
                        {arg.date.getDay() === 1 ? <div className={styles.dayName}>MON</div> : null}
                        {arg.date.getDay() === 2 ? <div className={styles.dayName}>TUE</div> : null}
                        {arg.date.getDay() === 3 ? <div className={styles.dayName}>WED</div> : null}
                        {arg.date.getDay() === 4 ? <div className={styles.dayName}>THU</div> : null}
                        {arg.date.getDay() === 5 ? <div className={styles.dayName}>FRI</div> : null}
                        {arg.date.getDay() === 6 ? <div className={styles.dayName}>SAT</div> : null}

                        {
                            monthViewWeeknumber ?

                                null
                                :
                                <div className={styles.daydate}>
                                    {arg.date.getDate()}
                                </div>
                        }

                    </div>
                </div >
            )
        }
    }


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
                    arg.event.extendedProps.icon === "" ? null :
                        <div className={styles.evenIconHolder}>

                            <div className={styles.eventIcon}>
                                <Image
                                    src={arg.event.extendedProps.icon}
                                    alt="icon"
                                    fill
                                />
                            </div>
                        </div>
                }

            </div>

        )
    }

    function slotLabelFormat(arg) {
        return (
            <div className={styles.slotLabelFormat}>
                {arg.start.hour}
            </div>
        )
    }

    useEffect(() => {

        resizeCalendar()

    }, [toggleValue])


    useEffect(() => {

        getWeather()

    }, [settings.latitude, settings.longitude])


    useEffect(() => {

        if (eventsPanel === false) {
            setTimeout(() => {
                getEvents()
            }, 100)
        }

    }, [eventsPanel])


    useEffect(() => {

        getEvents()
        getWeekNumber();
        titleFullCalendar();


    }, [])



    // function updateNowIndicator() {
    //     const calendarApi = calendarComponentRef.current.getApi();
    //     //set the claendar timezone to the selected timezone
    //     calendarApi.setOption(
    //         'timeZone', "America/Los_Angeles",
    //         "now", moment.tz(new Date(), "America/Los_Angeles").format()
    //     );
    // }

    // useEffect(() => {
    //     updateNowIndicator();
    // }, [settings.time_zone]);



    // function nowIndicator(arg) {
    //     let currentDate = new Date();
    //     let timeZone = settings.time_zone;

    //     return moment.tz(currentDate, "America/Los_Angeles").format();
    // }

    //add " to the begin and end of the time zone string


    let time_zone123 = settings.time_zone || 'UTC';
    return (
        <>
            <div className={`${styles.buttonTools} ${marginLeftStyle}`}>

                <RightIconButton
                    icon={<AddIcon />}
                    text="Create"
                    onClick={
                        () => {
                            setEventsPanel(true)
                            console.log("add event " + eventsPanel)
                        }
                    } />
                <Addevent />

                <select onChange={changeView} className={styles.select}>
                    <option value="timeGridWeek" defaultValue>Week</option>
                    <option value="timeGridDay" >Day</option>
                    <option value="dayGridMonth">Month</option>
                    {/* <option value="listWeek">List Week</option> */}
                </select>

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
            {/* <p>
                {weatherData?.list?.[0].main.temp} °C
            </p>
            <p>{weatherData?.list?.[0].weather[0].description}</p>
            <Image
                src={`https://openweathermap.org/img/wn/${weatherData?.list?.[0].weather[0].icon}@2x.png`}
                alt="weather icon"
                width={50}
                height={50}
            /> */}

            {
                settings.time_zone !== undefined | settings.time_zone !== null | settings.time_zone !== "" ?

                    <FullCalendar
                        plugins={[
                            timeGridPlugin,
                            interactionPlugin,
                            dayGridPlugin,

                        ]}
                        // defaultView="timeGridWeek"
                        height="89%"
                        eventBackgroundColor="#4c7987"
                        eventBorderColor="#ffffff00"
                        headerToolbar={false}
                        weekNumbers={false}
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}

                        handleWindowResize={true}
                        initialView={view}
                        ref={calendarComponentRef}
                        weekends={settings.ShowWeekends}
                        firstDay={firstDayOfWeek()}
                        longPressDelay={1000}
                        // slotMinTime={settings.BeginTimeDay}
                        // slotMaxTime={settings.EndTimeDay}

                        select={
                            function (arg) {
                                select(arg);
                            }
                        }

                        eventClick={
                            function (arg) {
                                eventClick(arg)
                            }
                        }

                        eventChange={
                            function (arg) {
                                eventChange(arg)
                            }
                        }

                        eventContent={
                            function (arg) {
                                if (monthViewWeeknumber === false) {
                                    return eventContent(arg)
                                }
                            }
                        }
                        timeZone={settings.time_zone}
                        nowIndicator={true}
                        // initialDate={moment.tz(new Date(), settings.time_zone).format("YYYY-MM-DD")}

                        // nowIndicator={
                        //     function (arg) {
                        //         return
                        //     }
                        // }

                        now={
                            function () {
                                return new Date()
                            }
                        }
                        viewClassNames={styles.moreLinkClassNames}





                        slotLabelFormat={
                            function (arg) {
                                return slotLabelFormat(arg)
                            }
                        }



                        dayHeaderClassNames={`${styles.dayHeaderClassNames}`}
                        //add class to the presentation of the day

                        dayHeaderContent={
                            function (arg) {
                                return dayHeaderContent(arg)
                            }
                        }

                        eventClassNames={styles.eventClassNames}
                        events={
                            events
                        }



                    />
                    :
                    null
            }

        </>
    )
}




           // [
                            //     {
                            //         title: '😀 event 1',
                            //         start: '2023-01-20 10:00:00',
                            //         end: '2023-01-20 11:00:00',
                            //         allDay: false,
                            //         backgroundColor: '#000000',
                            //         //add icon to the event title


                            //         daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
                            //         startTime: '10:00',
                            //         endTime: '11:00',





                            //     },
                            // ]