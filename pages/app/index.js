import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from "/styles/app.module.scss"

import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import AppLayout from "/layouts/appLayout"
import LoadingLine from '/components/loadingLine'
import { EventProvider } from "/layouts/stateStoreEvents"

import ListOfTasks from "/components/listOfTasks"
import ListOfNotes from "/components/listOfNotes"
import Calendar from '/components/calendar'

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

    const [panelData, setPanelData] = useState(
        <div className={styles.todoList}>
            <h2>Tasks</h2>
            <ListOfTasks></ListOfTasks>
        </div>
    )

    const [showSettings, setShowSettings, shortcutsPanel, setShortcutsPanel, settings, setSettings, saveButton, setSaveButton, settingsCopy, setSettingsCopy, warningPanel, setWarningPanel] = useStateStoreContext();

    //Not done yet, redirect the user to sign in page if not logged in
    useEffect(() => {
        if (!session) {
            // router.push("/sign-in")
        }
    })

    //switch between tasks and notes
    function switchPanel(event) {
        const panel = event.target.value

        switch (panel) {
            case "tasks":
                setPanelData(
                    <div className={styles.todoList}>
                        <h2>Tasks</h2>
                        <ListOfTasks></ListOfTasks>
                    </div>
                )
                break;
            case "notes":
                setPanelData(
                    <div className={styles.todoList}>
                        <h2>Notes</h2>
                        <ListOfNotes inApp={true}></ListOfNotes>
                    </div>
                )
                break;
            default:
                break;
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

                        <div className={styles.topNav}>
                            <button className={styles.buttonTodo}
                                onClick={
                                    (e) => { setTodoPanelToggle(!todoPanelToggle) }
                                }>

                                {todoPanelToggle ? "Close" : "Tasks & Notes"}
                            </button>
                        </div>
                        <div className={todoPanelStyle}>


                            <div >
                                <button className={styles.buttonAdd} onClick={switchPanel} value="tasks">Task</button>
                                <button className={styles.buttonAdd} onClick={switchPanel} value="notes">Notes</button>


                                <div className={styles.todoListHeader}>
                                    {panelData}
                                </div>


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