import React, { useState, useRef, useEffect } from 'react'
import styles from "/styles/addevent.module.scss"

//supabase
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'

//components
import toast, { Toaster } from 'react-hot-toast';
import { ButtonWithShortCut } from './buttons'
import moment from 'moment';
import { TwitterPicker } from 'react-color';

import { useStateStoreEventsContext } from "/layouts/stateStoreEvents"
import { useStateStoreContext } from "/layouts/stateStore"

//icons
import Icons from "/components/icons"
import Image from 'next/image';

const daysOfTheWeek = [
    { name: "Mo", value: 1 },
    { name: "Tu", value: 2 },
    { name: "We", value: 3 },
    { name: "Th", value: 4 },
    { name: "Fr", value: 5 },
    { name: "Sa", value: 6 },
    { name: "Su", value: 0 },
]


export default function Addevent() {

    //supabase
    const supabase = useSupabaseClient()
    const user = useUser()
    const session = useSession()

    //global state store
    //posible input id , title , description , allDay , backgroundColor , icon , startDate , startTime , endDate , endTime , daysOfWeek , startRecur , endRecur , startTime , endTime
    const [eventsPanel, setEventsPanel, input, setinput] = useStateStoreEventsContext()
    const [showSettings, setShowSettings, shortcutsPanel, setShortcutsPanel, settings, setSettings, saveButton, setSaveButton, settingsCopy, setSettingsCopy, warningPanel, setWarningPanel] = useStateStoreContext();



    //variable
    const [iconPanel, setIconPanel] = useState(false)
    const iconpanelstyle = iconPanel ? `${styles.iconPanel} ${styles.iconPanelOpen}` : `${styles.iconPanel} ${styles.iconPanelHidden}`



    //style
    const addEventStyle = eventsPanel ? `${styles.addEvent} ${styles.addEventOpen}` : `${styles.addEvent} ${styles.addEventHidden}`



    //##################################################################### createEvent , updateEvent , deleteEvent - start #############

    // Create new events 
    async function createEvent() {
        if (checkIfTheTitleIsEmpty()) {
            return
        }
        else {
            const { error } = await supabase
                .from('events')
                .insert({
                    user_id: user.id,

                    //event id auto generated

                    title: input.title,
                    description: input.description,
                    allDay: input.allDay,

                    backgroundColor: input.backgroundColor,
                    icon: input.icon,

                    startDate: input.startDate,
                    startTime: input.allDay ? null : input.startTime,
                    endDate: input.endDate,
                    endTime: input.allDay ? null : input.endTime,

                    activeRecur: input.activeRecur,
                    daysOfWeek: input.activeRecur ? input.daysOfWeek : [],
                })
                .eq('user_id', user.id)

            if (error) {
                console.log('error', error)
            }
            else {
                clearInput()
                setEventsPanel(false)
                removeElement()
                toast.success('Event created', {
                    iconTheme: {
                        primary: '#4C7987',
                        secondary: '#ffffff',
                    }
                });
            }
        }
    }

    //update event based on the id
    async function updateEvent(id) {
        if (checkIfTheTitleIsEmpty()) {
            return
        }
        else {
            const { data, error } = await supabase
                .from('events')
                .update({
                    title: input.title,
                    description: input.description,
                    allDay: input.allDay,

                    backgroundColor: input.backgroundColor,
                    icon: input.icon,

                    startDate: input.startDate,
                    startTime: input.allDay ? null : input.startTime,
                    endDate: input.endDate,
                    endTime: input.allDay ? null : input.endTime,

                    activeRecur: input.activeRecur,
                    daysOfWeek: input.activeRecur ? input.daysOfWeek : [],
                })
                .eq('id', id)
            if (error) {
                console.log('error', error)
                toast.error('Error ' + error.message);
            }
            else {
                clearInput()
                setEventsPanel(false)
                removeElement()

                toast.success('Event updated', {
                    iconTheme: {
                        primary: '#4C7987',
                        secondary: '#ffffff',
                    }
                });
            }
        }
    }

    //delete event based on the id
    async function deleteEvent(id) {
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id)
        if (error) {
            console.log('error', error)
        }
        else {
            toast.success('Event deleted', {
                iconTheme: {
                    primary: '#4C7987',
                    secondary: '#ffffff',

                }
            });
        }
    }

    //##################################################################### createEvent , updateEvent , deleteEvent - end #############



    //##################################################################### mini functions - start #############

    //ref to the hidden element
    const element = useRef(
        document.getElementById('element')
    );

    //remove the hidden element with ref from the dom
    function removeElement() {
        // setTimeout(() => {
        element.current.remove();
        // }, 500);
    }

    //add the hidden element with ref to the dom inside the div with id="addEvent"
    function addElement() {
        // add the hidden element with ref to the dom inside the div with id="addEvent"
        document.getElementById("addEvent").appendChild(element.current);
    }

    //add the hidden element with ref to the dom inside the div with id="addEvent" when the eventsPanel is true
    useEffect(() => {
        if (eventsPanel === true) {
            addElement()
        }
    }, [eventsPanel])

    //auto change textarea height based on the content
    function auto_grow(element) {
        element.style.height = "68px";
        element.style.height = (element.scrollHeight) + "px";
    }

    //add event listener to the document
    useEffect(() => {
        removeElement()
        document.addEventListener('keydown', handleKeyDown1);

        return () => {
            document.removeEventListener('keydown', handleKeyDown1);
        };

    }, []);

    //shortcuts event listener
    function handleKeyDown1(e) {
        //press control + enter to save or cmad + enter to save
        if ((e.ctrlKey || e.metaKey) && e.keyCode == 13) {
            console.log('ctrl + enter')
            if (input.id === "") {
                createEvent()
            }
            else {
                updateEvent(input.id)
            }
        }
        //press esc to close the modal
        if (e.keyCode == 27) {
            console.log('esc')
            setEventsPanel(false)
            removeElement()
        }
        //cntrl or cmd + shift + E to open the modal
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode == 69) {
            console.log('ctrl + shift + E')
            setEventsPanel(true)
            addElement()
        }

    }

    //Create a array with the days of the week you want to repeat the event on.
    function handleCheckboxChange(event) {

        //get the value of the checkbox and convert it to a number
        const value = parseInt(event.target.value)
        const list = [...input.daysOfWeek, value]

        // //order the array from smallest to biggest
        const orderTheListFromSmallestToBiggest = list.sort((a, b) => a - b)

        console.log(orderTheListFromSmallestToBiggest)
        setinput({
            ...input,
            activeRecur: true,
            daysOfWeek: orderTheListFromSmallestToBiggest
        })

    }

    function checkIfTheTitleIsEmpty() {
        if (input.title === "" && eventsPanel === true) {
            toast.error('Title is empty')
            return true
        }
        else {
            return false
        }
    }

    //empty the input fields
    function clearInput() {
        setinput({
            id: "",
            title: "",
            description: "",
            allDay: false,

            //style
            backgroundColor: "#4c7987",
            icon: "",

            //time
            startDate: "",
            startTime: "",
            endDate: "",
            endTime: "",

            //repeat
            daysOfWeek: [],
            startRecur: "",
            endRecur: "",
            startTime_recur: "",
            endTime_recur: "",
        })

        setIconPanel(false)
    }

    //empty the input date and time fields
    function clearDateAndTime() {
        setinput({
            ...input,
            startTime: "",
            endTime: "",

            startTime_recur: "",
            endTime_recur: "",
        })
    }

    //if the checkbox is checked, set the start and end date to empty
    useEffect(() => {
        if (input.allDay === true) {
            clearDateAndTime()
        }
    }, [input.allDay])

    //##################################################################### mini functions - end #############


    //##################################################################### useeffect date and time - start #############

    //if the start date is bigger than the end date, set the end date to the start date. it prevents the end date to be before the start date.
    useEffect(() => {
        if ((new Date(input.startDate) > new Date(input.endDate) || input.endDate === "") && eventsPanel === true) {
            setinput({
                ...input,
                endDate: input.startDate
            })
        }
    }, [input.startDate])


    //if the end date is before the start date, set the end date to the start date. it prevents the end date to be before the start date.
    useEffect(() => {
        //check if the end date is before the start date
        if (new Date(input.startDate) > new Date(input.endDate) || input.endDate === "" && input.startDate !== "") {
            toast.error('Chosen end date was before the start date.')
            toast.error('End date is set to the start date.')

            setinput({
                ...input,
                endDate: input.startDate
            })
        }
    }, [input.endDate])


    //if the start time is bigger than the end time, set the end time to one hour after the start time. it prevents the end time to be before the start time.
    useEffect(() => {

        //do that only if the end time is empty or if the end time is before the start time
        if (input.endTime === "" || new Date(input.startDate + " " + input.startTime) >= new Date(input.endDate + " " + input.endTime)) {

            //set the end time to one hour after the start time
            if (input.startTime !== "") {
                let startTime = input.startTime
                let endTime = startTime.split(":") //split the time into hours and minutes
                endTime[0] = parseInt(endTime[0]) + 1 //add one hour to the hours

                //fix 23:00 to 00:00
                if (endTime[0] === 24) {
                    endTime[0] = 0
                }

                endTime = endTime.join(":") //join the hours and minutes back together
                if (endTime.length === 4) {
                    endTime = "0" + endTime
                }
                setinput({
                    ...input,
                    endTime: endTime
                })
            }
        }
    }, [input.startTime])


    useEffect(() => {
        //check if the end time is before the start time
        if (new Date(input.startDate + " " + input.startTime) > new Date(input.endDate + " " + input.endTime)) {
            toast.error('Chosen end time was before the start time.')
            toast.error('End time is set to one hour after the start time.')

            setinput({
                ...input,
                endTime: input.startTime
            })
        }
    }, [input.endTime])

    //##################################################################### useeffect date and time - end #############


    return (
        <div id="addEvent">

            <div className={addEventStyle} ref={element}>
                <div className={styles.addeventPanel}>
                    <div className={styles.panelContent}>

                        <input
                            type="text"
                            name="title"
                            id="title"
                            placeholder='Event Title ..'
                            value={input.title}
                            required
                            onChange={e => {
                                setinput({
                                    ...input,
                                    title: e.target.value
                                })
                            }}
                            className={`${styles.eventTitleInput} ${styles.blok} ${styles.eventTitleInput}`}
                        />

                        <textarea
                            name="description"
                            id="description"
                            placeholder='Description ..'
                            className={`${styles.description} ${styles.blok}`}
                            value={input.description}
                            onChange={
                                e => {
                                    setinput({
                                        ...input,
                                        description: e.target.value
                                    })
                                    auto_grow(e.target)
                                }
                            }
                        >
                        </textarea>

                        <div className={`${styles.miniSection}`} >

                            {/*  check box */}
                            <div className={`${styles.blok} ${styles.smallGroup} ${styles.displayFlexSpecial}`}>
                                {/* check box */}
                                <label htmlFor="allDay" className={styles.miniTitle}>All Day Event</label>
                                <input type="checkbox"
                                    name="allDay"
                                    id="allDay"
                                    checked={input.allDay}
                                    className={styles.checkBox}
                                    onChange={
                                        e => {
                                            setinput({
                                                ...input,
                                                allDay: e.target.checked
                                            })
                                        }
                                    }
                                />
                            </div>

                            <div className={`${styles.blok} ${styles.smallGroup} ${styles.displayFlexSpecial}`}>
                                <div className={styles.holder}>

                                    <div className={`${styles.miniTitle} ${styles.addEmoji}`}
                                        onClick={() => {
                                            setIconPanel(!iconPanel)
                                        }}
                                    >
                                        Add a emoji

                                        {/*  if there is an icon selected, show it */}
                                        {
                                            input.icon !== "" ?
                                                <div onClick={e => { setinput({ ...input, icon: "" }) }}  >

                                                    <Image
                                                        src={input.icon}
                                                        alt="icon-selected"
                                                        width={18}
                                                        height={18}
                                                    />

                                                </div>

                                                : ""
                                        }

                                    </div>

                                    {/*  icons panel */}
                                    <div className={iconpanelstyle}>
                                        <Icons />
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* input date and time */}
                        <div className={`${styles.miniSection}`} >

                            <div className={`${styles.blok} ${styles.smallGroup}`}>
                                <div className={styles.miniTitle}>Starting <label htmlFor="date">Date</label> <label htmlFor="time" className={`${input.allDay ? styles.locked : null}`}>& Time</label></div>

                                <div className={styles.dateAndTimeDiv}>
                                    <input type="date" name="date" id="date" className={styles.inputeDateAndTime}
                                        value={input.startDate}
                                        onChange={
                                            e => {
                                                setinput({
                                                    ...input,
                                                    startDate: e.target.value
                                                })
                                            }
                                        }
                                    />
                                    <input type="time" name="time" id="time" className={`${styles.inputeDateAndTime} ${input.allDay ? styles.locked : null}`}
                                        value={input.startTime}
                                        onChange={(e) => {
                                            setinput({
                                                ...input,
                                                startTime: e.target.value,
                                            })
                                        }}

                                    />
                                </div>
                            </div>

                            <div className={`${styles.blok} ${styles.smallGroup} `}>
                                <div className={styles.miniTitle}>Ending <label htmlFor="date2">Date</label><label htmlFor="time2" className={input.allDay ? styles.locked : null}> & Time</label></div>

                                <div className={styles.dateAndTimeDiv}>
                                    <input type="date" name="date2" id="date2" className={styles.inputeDateAndTime}
                                        value={input.endDate}
                                        onChange={e => {
                                            setinput({
                                                ...input,
                                                endDate: e.target.value
                                            })
                                        }}
                                    />
                                    <input type="time" name="time2" id="time2" className={`${styles.inputeDateAndTime} ${input.allDay ? styles.locked : null}`}
                                        value={input.endTime}
                                        onChange={e => {
                                            setinput({
                                                ...input,
                                                endTime: e.target.value
                                            })
                                        }}
                                    />
                                </div>
                            </div>

                        </div>

                        <div className={`${styles.miniSection}`} >

                            <div className={`${styles.blok} ${styles.smallGroup}`}>

                                {/* input checkbox for the repeat option like Mo Tu We Th Fr Sa Su */}
                                <label htmlFor="repeat" className={styles.miniTitle}>Repeat on</label>

                                <div className={styles.repeatOnItem}>
                                    {
                                        daysOfTheWeek.map((day, index) => {
                                            return (

                                                <label htmlFor={`repeat${index}`} className={styles.repeatDay} key={index}>
                                                    <input type="radio" name={`repeat${index}`} id={`repeat${index}`} value={day.value} checked={input.daysOfWeek?.includes(day.value)}
                                                        onChange={
                                                            (e) => {
                                                                handleCheckboxChange(e)
                                                            }
                                                        } />
                                                    <span className={styles.repeatOnItemSpan}>{day.name}</span>
                                                </label>
                                            )
                                        }
                                        )
                                    }
                                </div>

                                <button className={styles.restButton} onClick={
                                    () => {
                                        setinput({
                                            ...input,
                                            activeRecur: false,
                                            daysOfWeek: []
                                        })
                                    }
                                }>Reset</button>

                                <p className={styles.info}>
                                    Make sure to select good start and end dates/time for your event.
                                </p>

                            </div>

                            <div className={`${styles.blok} ${styles.smallGroup}`}>

                                {/* input checkbox for the repeat option like Mo Tu We Th Fr Sa Su */}
                                <label htmlFor="Color" className={styles.miniTitle}>Color</label>

                                <TwitterPicker
                                    color={input.backgroundColor}
                                    onChangeComplete={color => {
                                        setinput({
                                            ...input,
                                            backgroundColor: color.hex
                                        })
                                    }}

                                    list of options
                                    colors={[
                                        "#4c7987",
                                        "#ff6901",
                                        "#fcb904",
                                        "#7bddb6",
                                        "#01d084",
                                        "#8fd1fc",
                                        "#0994e3",
                                        "#abb8c3",
                                        "#ec154d",
                                        "#f88da7",
                                    ]}

                                    //remove the default styles
                                    styles={{
                                        default: {
                                            card: {
                                                boxShadow: "none",
                                                border: "none",
                                                borderRadius: "0px",
                                                background: "none",
                                            },
                                            body: {
                                                padding: "0px",
                                                marginTop: "10px",
                                            },
                                            triangle: {
                                                display: "none",
                                            },
                                            triangleShadow: {
                                                display: "none",
                                            },

                                        },
                                    }}
                                />
                                <div style={{ backgroundColor: input.backgroundColor }} className={styles.colorPicker}></div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.buttons}>
                        <div className={styles.subButtons1}>

                            <ButtonWithShortCut
                                text="Cancel"
                                shortcut="ESC ⎋"
                                main={false}
                                onClick={() => {
                                    setEventsPanel(!eventsPanel)
                                    removeElement()
                                    clearInput()
                                }}
                            />

                            <ButtonWithShortCut
                                text={input.id === "" ? "Create" : "Update"}
                                shortcut="⌘ + ↵"
                                main={true}
                                onClick={input.id === "" ? () => { createEvent() } : () => { updateEvent(input.id) }}
                            />
                        </div>

                        {input.id === "" ? null :
                            <div className={styles.subButtons2}>

                                <ButtonWithShortCut
                                    text="Delete"
                                    shortcut="🗑️"
                                    main={false}
                                    onClick={() => {
                                        deleteEvent(input.id)
                                        setEventsPanel(!eventsPanel)
                                        removeElement()
                                        clearInput()
                                    }}
                                />

                            </div>
                        }
                    </div>
                </div>

                {/* background to close the panel*/}
                <div className={styles.bgClose} onClick={(e) => { { setEventsPanel(!eventsPanel) } removeElement(), clearInput() }}></div>
            </div>

            <Toaster position="bottom-right" reverseOrder={false} theme="auto" />
        </div >
    )
}
