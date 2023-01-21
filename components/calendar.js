import React, { useEffect, useState } from 'react'
import styles from "/styles/calendar.module.scss"
import moment from 'moment';

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
import momentTimezonePlugin from '@fullcalendar/moment-timezone'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
// import listPlugin from '@fullcalendar/list';

import { useStateStoreEventsContext } from "/layouts/stateStoreEvents"
import { useTime } from 'framer-motion';

import { useStateStoreContext } from "/layouts/stateStore"


export default function Calendar1({ panel, setPanel, toggleValue }) {

    const [eventsPanel, setEventsPanel, input, setinput] = useStateStoreEventsContext()

    const [showSettings, setShowSettings, shortcutsPanel, setShortcutsPanel, settings, setSettings, saveButton, setSaveButton, settingsCopy, setSettingsCopy] = useStateStoreContext();


    //supabase
    const session = useSession()
    const supabase = useSupabaseClient()
    const user = useUser()


    const marginLeftStyle = panel ? styles.WithoutMargin : styles.WithMargin;
    const [weeknumber, setWeeknumber] = useState(0);
    const [title, setTitle] = useState("");
    const [view, setView] = useState("timeGridWeek");
    const [monthViewWeeknumber, setMonthViewWeeknumber] = useState(false)

    const [addEvent, setAddEvent] = useState(false);

    //calendar reference
    const calendarComponentRef = React.createRef();

    //lieciesnse key for fullcalendar
    FullCalendar.licenseKey = "GPL-My-Project-Is-Open-Source";




    const [events, setEvents] = useState([]);
    const [unique, setUnique] = useState([]);

    //get the list of events from supabase
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
                    title: item.title,
                    id: item.id,
                    start: item.beginDate,
                    end: item.endDate,
                }])
            }
            )

            console.log(events)
        }
    }



    function getUniqueValues(array1, array2) {
        const values = array1.concat(array2)
        return values.filter((value, index, self) => self.findIndex((v) => v.id === value.id) === index)
    }


    //after loading the page, get the events from supabase
    useEffect(() => {
        getEvents()
    }, [])

    useEffect(() => {
        if (eventsPanel === false) {
            setTimeout(() => {
                getEvents()
            }, 100)
        }
    }, [eventsPanel])









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

        // setUnique([...unique, eventInfo])

        // const { data, error } = await supabase
        //     .from('events')
        //     .insert([
        //         eventInfo
        //     ])

        // if (error) console.log('error', error)
        // else {
        //     addEventsToTheCalendar()

        // }

    }

    async function eventClick(event) {

        convertFullDataToDataAndTime(event.event.startStr)
        convertFullDataToDataAndTime(event.event.endStr)

        setEventsPanel(true)
        setinput({
            ...input,
            id: event.event.id,
            title: event.event.title,
            startDate: convertFullDataToDataAndTime(event.event.startStr).dateWithouthTime,
            startTime: convertFullDataToDataAndTime(event.event.startStr).time,
            endDate: convertFullDataToDataAndTime(event.event.endStr).dateWithouthTime,
            endTime: convertFullDataToDataAndTime(event.event.endStr).time,
        })



    }

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
            // addEventsToTheCalendar()
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

    //Not completed yet - update the week number when the month view is selected
    //get week number in month view
    function weeknumberFirstweek() {
        if (weeknumber + 6 > 52) {
            return weeknumber + 6 - 52
        }
        else {
            return weeknumber + 5
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

    //weather and icons
    async function getWeatherForDate(date) {
        const apiKey = process.env.WEATHER_API_KEY
        const lat = "53.3498"
        const lon = "-6.2603"
        const time = Math.round(date.getTime() / 1000)

        const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,current&appid=${apiKey}&dt=${time}`

        const response = await fetch(url)
        return response.json()
    }

    function getWeatherIcon(weather) {
        const iconId = weather.daily[0].weather[0].icon
        const iconUrl = `https://openweathermap.org/img/wn/${iconId}@2x.png`

        return <img src={iconUrl} alt="Weather icon" />
    }

    const dayHeaderContent = (arg) => {

        const date = arg.date
        const weather = getWeatherForDate(date) // get the weather data for the current date
        const weatherIcon = getWeatherIcon(weather) // get the appropriate weather icon for the current weather

        return (
            <>
                <span>{date.toLocaleString()}</span>
                {weatherIcon}
            </>
        )
    }


    //add event function
    // function addEvent() {
    //     const calendarApi = calendarComponentRef.current.getApi();

    //     calendarApi.addEvent({
    //         title: "New Event",
    //         start: new Date(),
    //         allDay: true
    //     });
    // }

    //get the date as a string
    function getDate() {
        const calendarApi = calendarComponentRef.current.getApi();
    }

    //change fullcalendar design
    const handleDateClick = (arg) => {
        if (confirm("Would you like to add an event to " + arg.dateStr + " ?")) {
            calendarComponentRef.current.getApi().addEvent({
                title: "New Event",
                start: arg.date,
                allDay: arg.allDay
            });
        }
    };


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


    useEffect(() => {
        resizeCalendar()
    }, [toggleValue])

    useEffect(() => {

        getWeekNumber();
        titleFullCalendar();

    }, [])


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

                <div className={styles.weekNumber}>Week {weeknumber} {monthViewWeeknumber ?
                    weeknumberFirstweek() : ``}</div>
                {/* navigation buttons  */}
                <div className={styles.toolbarNavigationButton}>

                    <IconsOnly icon={<TwoArrowLeft />} onClick={preTwoWeeks} />
                    <IconsOnly icon={<OneArrowLeft />} onClick={preWeek} />
                    <TextOnly text="Today" onClick={today} />
                    <IconsOnly icon={<OneArrowRight />} onClick={nextWeek} />
                    <IconsOnly icon={<TwoArrowRight />} onClick={nextTwoWeeks} />

                </div>

            </div>

            <FullCalendar
                ref={calendarComponentRef}
                plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
                className='calendar2'
                initialView={view}
                headerToolbar={false}
                weekNumbers={false}
                height="85%"
                timeZone='local'
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                nowIndicator={true}
                eventBackgroundColor="#4c7987"
                eventBorderColor="#4c7987"
                handleWindowResize={true}
                dayHeaderFormat={{
                    weekday: 'short', month: 'short', day: 'numeric'
                }}
                slotLabelFormat={{
                    hour: 'numeric',
                    // minute: '2-digit',
                    meridiem: 'short'
                }}

                slotMinTime={settings.BeginTimeDay}
                slotMaxTime={settings.EndTimeDay}
                weekends={settings.ShowWeekends}

                //first day of the week monday
                firstDay={firstDayOfWeek()}










                longPressDelay={1000}
                // dayHeaderContent={dayHeaderContent}


                events={
                    events
                }




                select={
                    function (arg) {
                        select(arg);                    // addEventsToTheCalendar();
                    }
                }

                eventClick={function (arg) {
                    eventClick(arg)
                    // console.log(arg.event.title)
                    // console.log(arg.event.start)
                    // console.log(arg.event.end)
                }}

                eventChange={function (arg) {
                    eventChange(arg)
                }}

            // eventRemove={function (arg) {
            //     alert('removed ' + arg.event.title)
            // }}


            />
        </>
    )
}




