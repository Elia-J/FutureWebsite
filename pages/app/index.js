import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from "/styles/app.module.scss"

import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import AppLayout from "/layouts/appLayout"
import LoadingLine from '/components/loadingLine'
import { SettingsProvider } from "/layouts/stateStore"

import ListOfTasks from "/components/listOfTasks"
import Calendar from '/components/calendar'
export default function IndexApp() {

    //supabase
    const session = useSession()
    const supabase = useSupabaseClient()
    const user = useUser()

    const router = useRouter();
    const [data, setData] = useState([])

    //todo panel toggle
    const [todoPanelToggle, setTodoPanelToggle] = useState(false);
    const todoPanelStyle = todoPanelToggle ? `${styles.todoPnael} ${styles.todoPnaelOpen}` : `${styles.todoPnael} ${styles.todoPnaelClose}`;

    //Not done yet, redirect the user to sign in page if not logged in
    useEffect(() => {
        if (!session) {
            // router.push("/sign-in")
        }
    })

    if (session) {
        return (
            <SettingsProvider>
                <AppLayout>

                    <div className={styles.mainCalendar}>

                        <div className={styles.CalendarHeader}>
                            <Calendar panel={todoPanelToggle} setPanel={setTodoPanelToggle} />
                        </div>

                        <div className={todoPanelStyle}>

                            <div className={styles.topNav}>
                                <button className={styles.buttonTodo} onClick={() => setTodoPanelToggle(!todoPanelToggle)}>
                                    {todoPanelToggle ? "Close" : "Open Tasks"}
                                </button>
                            </div>

                            <div className={styles.todoList}>

                                <div className={styles.todoListHeader}>
                                    <h3>Tasks List</h3>

                                    <ListOfTasks></ListOfTasks>

                                </div>
                            </div>

                        </div>
                    </div>

                </AppLayout>
            </SettingsProvider >
        )
    }

    else {
        return (
            <LoadingLine />
        )
    }
}