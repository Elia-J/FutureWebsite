import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from "/styles/app.module.scss"

import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import AppLayout from "/layouts/appLayout"
import LoadingLine from '/components/loadingLine'
import { EventProvider } from "/layouts/stateStoreEvents"

import Calendar from '/components/calendar'

import Trash from "/public/trash.svg"

import { useStateStoreContext } from "/layouts/stateStore"

export default function IndexApp() {

    //supabase
    const session = useSession()
    const supabase = useSupabaseClient()
    const user = useUser()

    const router = useRouter();
    const [tasksData, setTasksData] = useState([])
    const [notesData, setNotesData] = useState([])

    //todo panel toggle
    const [todoPanelToggle, setTodoPanelToggle] = useState(false);
    const todoPanelStyle = todoPanelToggle ? `${styles.todoPnael} ${styles.todoPnaelOpen}` : `${styles.todoPnael} ${styles.todoPnaelClose}`;

    const [panelData, setPanelData] = useState()



    const [showSettings, setShowSettings, shortcutsPanel, setShortcutsPanel, settings, setSettings, saveButton, setSaveButton, settingsCopy, setSettingsCopy] = useStateStoreContext();



    //Not done yet, redirect the user to sign in page if not logged in
    useEffect(() => {
        if (!session) {
            // router.push("/sign-in")
        }
    })



    // useEffect(() => {
    //     getAllTask()
    //     getAllNotes()
    //     switchPanel({ target: { value: "tasks" } })
    // }, [todoPanelToggle])

    // useEffect(() => {
    //     getAllNotes()
    // }, [removeNote])



    // get all task from supabase
    // async function getAllTask() {
    //     const { data, error } = await supabase
    //         .from('todos')
    //         .select('*')
    //         .order('title', { ascending: true })
    //     // .eq('user_id', user.id)

    //     if (data) {
    //         setTasksData(data)
    //     }

    //     if (error) {
    //         console.log(error)
    //     }

    //     else {
    //         console.log(data)
    //     }
    // }

    // //get all notes from supabase
    // async function getAllNotes() {
    //     const { data, error } = await supabase
    //         .from('notesv2')
    //         .select('*')
    //         .order('title', { ascending: true })
    //     // .eq('user_id', user.id)
    //     if (data) {
    //         setNotesData(data)
    //         console.log(data)
    //     }
    //     if (error) {
    //         console.log(error)
    //     }
    // }

    // // Remove notes with id
    // async function removeNote(id) {
    //     const { data, error } = await supabase
    //         .from('notesv2')
    //         .delete()
    //         .eq('id', id)
    //     if (data) {
    //         //array of todos
    //         setData(data)
    //     } if (error) {
    //         console.log('error', error)
    //         return
    //     }
    // }

    //switch between tasks and notes
    function switchPanel(event) {
        const panel = event.target.value

        if (panel === "tasks") {
            setPanelData(
                <div className={styles.todoList}>
                    <h2>Tasks</h2>
                    {tasksData.map((item) => {
                        return (
                            <div className={styles.todoItem} key={item.id}>
                                <h4>{item.title}</h4>
                                <p>{item.description}</p>
                            </div>
                        )
                    }
                    )}
                </div>
            )
        }
        if (panel === "notes") {
            setPanelData(
                <div className={styles.todoList}>
                    <h2>Notes</h2>
                    {notesData.map((item) => {
                        const title = JSON.parse(item.title)[0].children[0].text
                        const description = item.description[0].children[0].text

                        return (
                            <Link href={`/app/note/${item.id}`} key={item.id}>
                                <div className={styles.notesItems}>
                                    <div className={styles.titleWithIcon}>
                                        <h4 className={styles.notesTitle}>{title}</h4>
                                        <button className={styles.trash} onClick={() => removeNote(item.id)}><Trash /> </button>
                                    </div>
                                    <p className={styles.notesDescription}>{description}</p>

                                </div>
                            </Link>
                        )
                    })}

                </div>
            )
        }
    }



    if (session) {
        return (
            <EventProvider>
                <AppLayout>

                    <div className={styles.mainCalendar}>
                        <div className={styles.CalendarHeader}>
                            <Calendar panel={todoPanelToggle} setPanel={setTodoPanelToggle} toggleValue={todoPanelToggle} />
                        </div>

                        <div className={todoPanelStyle}>

                            <div className={styles.topNav}>
                                <button className={styles.buttonTodo}
                                    onClick={
                                        (e) => { setTodoPanelToggle(!todoPanelToggle) }
                                    }>

                                    {todoPanelToggle ? "Close" : "Tasks & Notes"}
                                </button>
                            </div>

                            <div className={styles.todoListHeader}>
                                <button className={styles.buttonAdd} onClick={switchPanel} value="tasks">Task</button>
                                <button className={styles.buttonAdd} onClick={switchPanel} value="notes">Notes</button>

                                {panelData}


                            </div>


                        </div>
                    </div>

                </AppLayout>
            </EventProvider>
        )
    }

    else {
        return (
            <LoadingLine />
        )
    }
}