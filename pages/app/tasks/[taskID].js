import React, { useEffect, useState } from 'react'
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import styles from "/styles/task.module.scss"
import AppLayout from "/layouts/appLayout"
import ListOfTasks from '../../../components/listOfTasks'
import { SettingsProvider } from "/layouts/stateStore"
import { useRouter } from 'next/router'

export default function Tasks() {
    const session = useSession()
    const supabase = useSupabaseClient()
    const user = useUser()
    const router = useRouter()
    const {taskID} = router.query

    // Create a new task in supabase
    async function CreateTaskSupabase() {
        let nullDate = new Date(null)
        if (taskDate.getFullYear === nullDate.getFullYear && taskTime.getFullYear === nullDate.getFullYear) {
            const { data, error } = await supabase
                .from('todos')
                .insert({ user_id: user.id, title: taskTitle, date: null, time: null, description: taskDescription })
        }
        else if (taskDate.getFullYear === nullDate.getFullYear) {
            const { data, error } = await supabase
                .from('todos')
                .insert({ user_id: user.id, title: taskTitle, date: null, time: taskTime, description: taskDescription })
        }
        else if (taskTime.getFullYear === nullDate.getFullYear) {
            const { data, error } = await supabase
                .from('todos')
                .insert({ user_id: user.id, title: taskTitle, date: taskDate, time: null, description: taskDescription })
        }
        else {
            const { data, error } = await supabase
                .from('todos')
                .insert({ user_id: user.id, title: taskTitle, date: taskDate, time: taskTime, description: taskDescription })
        }
        setReload(true)
        setCreatingTask(false)
    }

    // Edits a task in supabase
    async function EditTaskSupabase() {
        if (taskDate === undefined && taskTime === undefined) {
            const { data, error } = await supabase
                .from('todos')
                .update({ title: taskTitle, date: null, time: null, description: taskDescription })
                .eq('id', taskID)
        }
        else if (taskDate === undefined) {
            const { data, error } = await supabase
                .from('todos')
                .update({ title: taskTitle, date: null, time: taskTime, description: taskDescription })
                .eq('id', taskID)
        }
        else if (taskTime === undefined) {
            const { data, error } = await supabase
                .from('todos')
                .update({ title: taskTitle, date: taskDate, time: null, description: taskDescription })
                .eq('id', taskID)
        }
        else {
            const { data, error } = await supabase
                .from('todos')
                .update({ title: taskTitle, date: taskDate, time: taskTime, description: taskDescription })
                .eq('id', taskID)
        }
        setReload(true)
        setEditingTask(false)
    }

    // Deletes a task in supabase
    async function DiscardTaskSupabase() {
        const { data, error } = await supabase
            .from('todos')
            .delete()
            .eq('id', taskID)

        setReload(true)
        setEditingTask(false)
    }

    // Function that sets all the states according to the given task and sets editingTask to true
    function EditTask(task) {
        setTaskTitle(task.title)
        if (task.date === null) {
            setTaskDate(new Date(null))
        }
        else {
            setTaskDate(task.date)
        }
        if (task.time === null) {
            setTaskTime(new Date(null))
        }
        else {
            setTaskTime(task.time)
        }
        setTaskDescription(task.description)
        setEditingTask(true)
    }

    // Function that resets all the states to their zero state and sets creatingTask to true
    function CreateTask() {
        setTaskTitle("")
        setTaskDate(new Date(null))
        setTaskTime(new Date(null))
        setTaskDescription("")
        setCreatingTask(true)
        setReload(false)
    }

    function CancelTask() {
        setCreatingTask(false)
        setEditingTask(false)
        setReload(false)
    }

    // Get the to be edited task from supabase
    async function GetTask(taskID) {
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .is('id', taskID)
        if (data) {
            console.log("Task", data)
            CreateTask()
        }
        if (error) {
            console.log('error', error)
            return
        }
    }

    const [creatingTask, setCreatingTask] = useState(false)
    const [editingTask, setEditingTask] = useState(false)
    const [reload, setReload] = useState(false)

    const [taskTitle, setTaskTitle] = useState("")
    const [taskDate, setTaskDate] = useState(new Date(null))
    const [taskTime, setTaskTime] = useState(new Date(null))
    const [taskDescription, setTaskDescription] = useState("")

    useEffect(() => {
        CreateTask()
    }, [])
    
    if(session)
        return(
            <div>
                <div className={creatingTask || editingTask ? styles.blur : null}>
                    <SettingsProvider>
                        <AppLayout>
                            <div>
                                <div>
                                    <button className={styles.mainButton} onClick={CreateTask}>
                                        <span className={styles.create}>Create </span>
                                        <span>+</span>
                                    </button>
                                    <h1 className={styles.h1}>Tasks</h1>
                                </div>
                                <ListOfTasks reload={reload}></ListOfTasks>
                            </div>
                        </AppLayout>
                    </SettingsProvider>
                </div>

                <div className={creatingTask || editingTask ? styles.taskForm : `${styles.hiddenTaskForm} ${styles.taskForm}`}>
                    <button className={styles.cancelButton} onClick={CancelTask}>x</button>
                    <div className={styles.titleHeader}>
                        <div className={`${styles.titleInputContainer} ${styles.inputContainer}`}>
                            <label className={styles.label}>Task title:</label>
                            <input className={styles.input}
                                id="title"
                                type="text"
                                name="taskTitle"
                                placeholder="Task Title"
                                value={taskTitle}
                                required
                                onChange={(event) => setTaskTitle(event.target.value)}
                            ></input>
                        </div>
                    </div>
                    <div className={styles.NonTitleInputContainer}>
                        <div className={styles.inputContainer}>
                            <label className={styles.label}>Date:</label>
                            <input className={styles.input}
                                id="date"
                                type="date"
                                name="taskDate"
                                value={taskDate}
                                onChange={(event) => setTaskDate(event.target.value)}
                            ></input>
                        </div>
                        <div className={styles.inputContainer}>
                            <label className={styles.label}>Time:</label>
                            <input className={styles.input}
                                id="time"
                                type="time"
                                name="taskTime"
                                value={taskTime}
                                onChange={(event) => setTaskTime(event.target.value)}
                            ></input>
                        </div>
                        <div className={styles.inputContainer}>
                            <label className={styles.label}>Description:</label>
                            <textarea className={styles.input}
                                style={{ height: '120px' }}
                                rows="10"
                                cols="10"
                                id="description"
                                type="text"
                                name="taskDescription"
                                placeholder="Description"
                                value={taskDescription}
                                onChange={(event) => setTaskDescription(event.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    <div styles={styles.buttonContainer}>
                        <button className={styles.saveButton} onClick={taskTitle.length >= 4 ? (editingTask ? EditTaskSupabase : CreateTaskSupabase) : null}>Save</button>
                        <button className={`${styles.discardButton} ${styles.saveButton}`} onClick={editingTask ? DiscardTaskSupabase : CancelTask}>Discard</button>
                    </div>
                </div>
            </div>
        )
}