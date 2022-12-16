import React, { useEffect, useState } from 'react'
import styles from "/styles/calendar.module.scss"
import moment from 'moment';


//supabase
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'


//components
import { IconsOnly, TextOnly, RightIconButton } from './buttons';


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
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!


export default function Calendar1({ panel, setPanel }) {

    //supabase
    const session = useSession()
    const supabase = useSupabaseClient()
    const user = useUser()


    const marginLeftStyle = panel ? styles.WithoutMargin : styles.WithMargin;
    const [weeknumber, setWeeknumber] = useState(0);
    const [title, setTitle] = useState("");
    const [view, setView] = useState("timeGridWeek");
    const [monthViewWeeknumber, setMonthViewWeeknumber] = useState(false)


    //calendar reference
    const calendarComponentRef = React.createRef();
    //lieciesnse key for fullcalendar
    FullCalendar.licenseKey = "GPL-My-Project-Is-Open-Source";


    const [event, setEvent] = useState([]);

    //get the list of events from supabase
    async function getEvents() {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('title', { ascending: true })
            .eq('user_id', user.id)

        if (data) {
            {
                data.map((item) => {
                    setEvent((event) => [...event, {
                        title: item.title,
                        start: item.beginDate,
                        end: item.endDate,
                    }])
                }
                )
            }
        }
        if (error) {
            console.log(error)
        }
        else {
            console.log(data)
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

            console.log(weekNo)
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

    useEffect(() => {
        getWeekNumber();
        titleFullCalendar();
        getEvents();


    }, [])


    const getEvesefnts = async () => {
        console.log(event)
    }

    //add event function
    function addEvent() {
        const calendarApi = calendarComponentRef.current.getApi();

        calendarApi.addEvent({
            title: "New Event",
            start: new Date(),
            allDay: true
        });
    }

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

    //add event to the database
    async function addEventToDatabase(event) {
        const { data, error } = await supabase
            .from('events')
            .insert([
                {
                    title: "test 1", //change this later
                    beginDate: event.start,
                    endDate: event.end,
                    user_id: user.id
                }
            ]


            )
        if (error) console.log('error', error)
        else console.log('data', data)
    }


    return (
        <>
            <div className={`${styles.buttonTools} ${marginLeftStyle}`}>

                <RightIconButton icon={<AddIcon />} text="Create" onClick={addEvent} />



                <select onChange={changeView} className={styles.select}>
                    <option value="timeGridWeek" defaultValue>Week</option>
                    <option value="timeGridDay" >Day</option>
                    <option value="dayGridMonth">Month</option>
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
                plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
                initialView={view}
                headerToolbar={false}
                weekNumbers={true}
                height="85%"
                timeZone='local'
                weekends={true}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                nowIndicator={true}
                ref={calendarComponentRef}
                firstDay={1}
                events={event}
                eventBackgroundColor="#4c7987"
                eventBorderColor="#4c7987"

                select={function (arg) {
                    addEventToDatabase(arg);
                    setEvent([]);
                    getEvents();
                }}
                eventClick={function (arg) {
                    alert('clicked ' + arg.event.title)
                }}
            />
        </>
    )
}

