import React, { useState, useRef, useEffect } from 'react'
import styles from "/styles/addevent.module.scss"
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import toast, { Toaster } from 'react-hot-toast';
import { ButtonWithShortCut, RightIconButton } from './buttons'
import AddIcon from "/public/AddIcon.svg"

import { useStateStoreEventsContext } from "/layouts/stateStoreEvents"


import moment from 'moment';
import { TwitterPicker } from 'react-color';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { get } from 'http';

export default function Addevent() {

    //supabase
    const supabase = useSupabaseClient()
    const user = useUser()
    const session = useSession()

    //global state store
    const [eventsPanel, setEventsPanel, input, setinput] = useStateStoreEventsContext()


    //variable
    const [iconPanel, setIconPanel] = useState(false)
    const iconpanelstyle = iconPanel ? `${styles.iconPanel} ${styles.iconPanelOpen}` : `${styles.iconPanel} ${styles.iconPanelHidden}`

    //error detection
    const [error, setError] = useState({
        title: false,
        description: false,
        startDate: false,
        startTime: false,
        endDate: false,
        endTime: false,
        allDay: false,
    })

    //empty the input fields
    function clearInput() {
        setinput({
            id: "",
            title: "",
            description: "",
            backgroundColor: "#4c7987",
            icon: "",
            startDate: "",
            startTime: "",
            endDate: "",
            endTime: "",
            allDay: false,
        })
    }

    //empty the input date and time fields
    function clearDateAndTime() {
        setinput({
            ...input,
            startDate: "",
            startTime: "",
            endDate: "",
            endTime: "",
        })
    }

    //reset error detection
    function resetError() {
        setError({
            title: false,
            description: false,
            startDate: false,
            startTime: false,
            endDate: false,
            endTime: false,
            allDay: false,
        })
    }


    //styles
    const addEventStyle = eventsPanel ? `${styles.addEvent} ${styles.addEventOpen}` : `${styles.addEvent} ${styles.addEventHidden}`


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

    // Create new events 
    async function createEvent() {
        if (input.title === "") {
            toast.error('Please add a title')
            setError({
                title: true,
            })
            return
        }

        const beginDateValue = input.allDay ? input.startDate : input.startDate + " " + input.startTime
        const endDateValue = input.allDay ? null : input.endDate + " " + input.endTime

        const { error } = await supabase
            .from('events')
            .insert({
                user_id: user.id,
                title: input.title,
                description: input.description,
                backgroundColor: input.backgroundColor,
                icon: input.icon,

                beginDate: beginDateValue,
                endDate: endDateValue,
                allDay: input.allDay,
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

    //update event based on the id
    async function updateEvent(id) {
        console.log('id', id)
        console.log('input', input)
        console.log('input', input.startDate + " " + input.startTime)
        const { data, error } = await supabase
            .from('events')
            .update({
                title: input.title,
                description: input.description,
                beginDate: moment(input.startDate + " " + input.startTime).format("YYYY-MM-DD HH:mm:ss"),
                endDate: moment(input.endDate + " " + input.endTime).format("YYYY-MM-DD HH:mm:ss"),
                backgroundColor: input.backgroundColor,
                icon: input.icon,
            })
            .eq('id', id)
        if (error) {
            console.log('error', error)
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

    //auto change textarea height
    function auto_grow(element) {
        element.style.height = "68px";
        element.style.height = (element.scrollHeight) + "px";
    }

    //convert date and time to one string using moment.js
    function convertDateAndTime() {
        const beginDateValue = input.allDay ? moment(input.startDate).format("YYYY-MM-DD") : moment(input.startDate + " " + input.startTime).format("YYYY-MM-DD HH:mm:ss")
        const endDateValue = input.allDay ? null : moment(input.endDate + " " + input.endTime).format("YYYY-MM-DD HH:mm:ss")
        return {
            beginDateValue,
            endDateValue
        }
    }





    //press control + enter to save or cmad + enter to save
    //press esc to close the modal
    //cntrl or cmd + shift + E to open the modal
    function handleKeyDown1(e) {
        if ((e.ctrlKey || e.metaKey) && e.keyCode == 13) {
            console.log('ctrl + enter')
            createEvent()

        }
        if (e.keyCode == 27) {
            console.log('esc')
            setEventsPanel(false)
            removeElement()
        }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode == 69) {
            console.log('ctrl + shift + E')
            setEventsPanel(true)
            addElement()
        }

    }


    //add event listener to the document
    useEffect(() => {
        removeElement()
        document.addEventListener('keydown', handleKeyDown1);

        return () => {
            document.removeEventListener('keydown', handleKeyDown1);
        };
    }, []);

    //if the checkbox is checked, set the start and end date to empty
    useEffect(() => {
        if (input.allDay === true) {
            clearDateAndTime()
        }
    }, [input.allDay])


    useEffect(() => {
        if (new Date(input.startDate) > new Date(input.endDate) || input.endDate === "") {
            setinput({
                ...input,
                endDate: input.startDate
            })
        }

    }, [input.startDate])


    useEffect(() => {
        //check if the end date is before the start date
        if (new Date(input.startDate) > new Date(input.endDate) || input.endDate === "" && input.startDate !== "") {
            console.log("end date is before start date")
            toast.error('Chosen end date was before the start date.')
            toast.error('End date is set to the start date.')

            setinput({
                ...input,
                endDate: input.startDate
            })
        }
    }, [input.endDate])


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
            console.log("end time is before start time")
            toast.error('Chosen end time was before the start time.')
            toast.error('End time is set to one hour after the start time.')

            setinput({
                ...input,
                endTime: input.startTime
            })
        }
    }, [input.endTime])


    useEffect(() => {
        if (eventsPanel === true) {
            addElement()
        }
    }, [eventsPanel])

    // function console123() {
    //     console.log("title " + input.title)

    // }


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
                            onChange={e => {
                                setinput({
                                    ...input,
                                    title: e.target.value
                                })
                                setError({ title: false })
                            }}
                            className={`${styles.eventTitleInput} ${styles.blok} ${error.title ? styles.error : styles.eventTitleInput}`} />


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

                            {/*  check box*/}
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
                                <div
                                    className={`${styles.miniTitle} ${styles.addEmoji}`}
                                    onClick={() => {
                                        setIconPanel(!iconPanel)
                                    }}

                                >Add a emoji {input.icon !== "" ? input.icon : ""}</div>

                                <div className={iconpanelstyle}>
                                    <div className={styles.emojiPicker}>

                                        <Picker
                                            data={data}
                                            onEmojiSelect={
                                                (emoji) => {
                                                    console.log(emoji)
                                                    setinput({
                                                        ...input,
                                                        icon: emoji.native,
                                                    })
                                                    setIconPanel(!iconPanel)
                                                }
                                            }
                                            theme="dark"
                                            previewEmoji="none"
                                            showSkinTones={false}
                                            locale="en"
                                            perLine={8}





                                        />

                                    </div>
                                    <div className={styles.background}
                                        onClick={() => {
                                            setIconPanel(!iconPanel)
                                        }}
                                    ></div>

                                </div>

                            </div>


                        </div>


                        {/* input date and time */}
                        <div className={`${styles.miniSection}`} >

                            <div className={`${styles.blok} ${styles.smallGroup}`}>
                                <div className={styles.miniTitle}>{input.allDay ? "" : "Starting"
                                } <label htmlFor="date">Date</label> <label htmlFor="time" className={`${input.allDay ? styles.locked : null}`}>& Time</label></div>

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


                            <div className={`${styles.blok} ${styles.smallGroup} ${input.allDay ? styles.locked : null}`}>
                                <div className={styles.miniTitle}>Ending <label htmlFor="date2">Date</label> & <label htmlFor="time2">Time</label></div>

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
                                    <input type="time" name="time2" id="time2" className={styles.inputeDateAndTime}
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

                            {/* dropdown */}
                            {/* <div className={`${styles.blok} ${styles.smallGroup}`}>
                                <label htmlFor="repeat" className={styles.miniTitle}>Repeat</label>
                                <select name="repeat" id="repeat" className={styles.selectMenu}>
                                    <option value="none">None</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div> */}

                            <div className={`${styles.blok} ${styles.smallGroup}`}>

                                {/* input checkbox for the repeat option like Mo Tu We Th Fr Sa Su */}
                                <label htmlFor="repeat" className={styles.miniTitle}>Repeat on</label>
                                <div className={styles.repeatOn}>
                                    <div className={styles.repeatOnItem}>

                                        <input type="checkbox" name="repeat0" id="repeat0" className={styles.checkBox}
                                            value={[0]}
                                            onchange={
                                                e => {
                                                    setinput({
                                                        ...input,
                                                        //add to the array
                                                        daysOfWeek: [...input.daysOfWeek, e.target.value]
                                                    })
                                                }
                                            }
                                        />
                                        < label htmlFor="repeat0">Mo</label>

                                        <input type="checkbox" name="repeat1" id="repeat1" className={styles.checkBox}
                                            value={[1]}
                                        />
                                        <label htmlFor="repeat1">Tu</label>

                                        <input type="checkbox" name="repeat2" id="repeat2" className={styles.checkBox}
                                            value={[2]}
                                        />
                                        <label htmlFor="repeat2">We</label>

                                        <input type="checkbox" name="repeat3" id="repeat3" className={styles.checkBox}
                                            value={[3]}
                                        />
                                        <label htmlFor="repeat3">Th</label>

                                        <input type="checkbox" name="repeat4" id="repeat4" className={styles.checkBox}
                                            value={[4]}
                                        />
                                        <label htmlFor="repeat4">Fr</label>

                                        <input type="checkbox" name="repeat5" id="repeat5" className={styles.checkBox}
                                            value={[5]}
                                        />
                                        <label htmlFor="repeat5">Sa</label>

                                        <input type="checkbox" name="repeat6" id="repeat6" className={styles.checkBox}
                                            value={[6]}
                                        />
                                        <label htmlFor="repeat6">Su</label>

                                    </div>

                                </div>


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
                                    resetError()
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
                                        resetError()
                                    }}
                                />
                                <span className={styles.eventId}>ID: {input.id}</span>
                            </div>
                        }


                        {/* <button onClick={console123}>console</button> */}

                    </div>
                </div>


                <div className={styles.bgClose} onClick={(e) => { { setEventsPanel(!eventsPanel) } removeElement(), clearInput() }}></div>

            </div>
            <Toaster
                position="bottom-right"
                reverseOrder={false}
                theme="auto"

            />

        </div >
    )
}
