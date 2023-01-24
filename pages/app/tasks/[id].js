import React, { useEffect, useState } from 'react'
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import styles from "/styles/task.module.scss"
import AppLayout from "/layouts/appLayout"
import ListOfTasks from "/components/listOfTasks"
import { useRouter } from 'next/router'
import { supabase } from '/lib/supasbaseClient'

export default function Tasks( {taskID} ) {
    const session = useSession()
    const supabase = useSupabaseClient()
    const user = useUser()
    const router = useRouter()
    const [task, setTask] = useState([])

    async function GetTask() {
        const{data, error} = await supabase
        .from('todos')
        .select('*')
        .eq('id', taskID)
        if(data) {
            setTask(data[0])
            console.log("Task" + task)
        }
        if(error) {
            console.log(error)
        }
    }

    // Get all folders from supabase
    async function GetFoldersSupabase() {
        const { data, error } = await supabase
            .from('todosFolders')
            .select('*')
        if (data) {
            setFolders(data)
        }
        if (error) {
            console.log('error', error)
            return
        }
    }

    // Get all the tasks associated with a certain folder
    async function GetFolderTasksSupabase(folder) {
        const {data, error} = await supabase
            .from('todos')
            .select('*')
            .eq('folder_id', folder.id)
        if (data) {
            return data
        }
        if (error) {
            console.log('error', error)
            return
        }
    }

    // Create a new folder in supabase
    async function CreateFolderSupabase() {
        const { data, error } = await supabase
                .from('todosFolders')
                .insert({ user_id: user.id, title: folderTitle})
        GetFoldersSupabase()
    }

    // Discards a folder in supabase
    async function DiscardFolderSupabase(folder_id) {
        const { data, error } = await supabase
            .from('todosFolders')
            .delete()
            .eq('id', folder_id)

        GetFoldersSupabase()
    }

    // Create a new task in supabase
    async function CreateTaskSupabase() {
        console.log("FolderID: " + folderID)
        let nullDate = new Date(null)
        if (taskDate.getFullYear === nullDate.getFullYear && taskTime.getFullYear === nullDate.getFullYear) {
            const { data, error } = await supabase
                .from('todos')
                .insert({ user_id: user.id, title: taskTitle, date: null, time: null, description: taskDescription, priority: taskPriority, folder_id: folderID})
        }
        else if (taskDate.getFullYear === nullDate.getFullYear) {
            const { data, error } = await supabase
                .from('todos')
                .insert({ user_id: user.id, title: taskTitle, date: null, time: taskTime, description: taskDescription, priority: taskPriority, folder_id: folderID })
        }
        else if (taskTime.getFullYear === nullDate.getFullYear) {
            const { data, error } = await supabase
                .from('todos')
                .insert({ user_id: user.id, title: taskTitle, date: taskDate, time: null, description: taskDescription, priority: taskPriority, folder_id: folderID })
        }
        else {
            const { data, error } = await supabase
                .from('todos')
                .insert({ user_id: user.id, title: taskTitle, date: taskDate, time: taskTime, description: taskDescription, priority: taskPriority, folder_id: folderID })
        }
        setReload(true)
        setCreatingTask(false)
    }

    // Edits a task in supabase
    async function EditTaskSupabase() {
        if (taskDate === undefined && taskTime === undefined) {
            const { data, error } = await supabase
                .from('todos')
                .update({ title: taskTitle, date: null, time: null, description: taskDescription, priority: taskPriority, folder_id: folderID })
                .eq('id', taskID)
        }
        else if (taskDate === undefined) {
            const { data, error } = await supabase
                .from('todos')
                .update({ title: taskTitle, date: null, time: taskTime, description: taskDescription, priority: taskPriority, folder_id: folderID })
                .eq('id', taskID)
        }
        else if (taskTime === undefined) {
            const { data, error } = await supabase
                .from('todos')
                .update({ title: taskTitle, date: taskDate, time: null, description: taskDescription, priority: taskPriority, folder_id: folderID })
                .eq('id', taskID)
        }
        else {
            const { data, error } = await supabase
                .from('todos')
                .update({ title: taskTitle, date: taskDate, time: taskTime, description: taskDescription, priority: taskPriority, folder_id: folderID })
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
    function EditTask() {
        console.log("task.title" + task)
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
        setTaskPriority(task.priority)
        setEditingTask(true)
    }

    // Function that resets all the states to their zero state and sets creatingTask to true
    function CreateTask() {
        setTaskTitle("")
        setTaskDate(new Date(null))
        setTaskTime(new Date(null))
        setTaskDescription("")
        setTaskPriority(0)
        setCreatingTask(true)
        setReload(false)
    }

    function CancelTask() {
        setCreatingTask(false)
        setEditingTask(false)
        setReload(false)
    }

    const [creatingTask, setCreatingTask] = useState(false)
    const [editingTask, setEditingTask] = useState(false)
    const [reload, setReload] = useState(false)

    const [taskTitle, setTaskTitle] = useState("")
    const [taskDate, setTaskDate] = useState(new Date(null))
    const [taskTime, setTaskTime] = useState(new Date(null))
    const [taskDescription, setTaskDescription] = useState("")
    const [taskPriority, setTaskPriority] = useState(0)
    const [folderID, setFolderID] = useState(null)

    const [folderTitle, setFolderTitle] = useState("")

    const [openPanel, setOpenPanel] = useState(false)
    const [AIPanel, setAIPanel] = useState(false)

    const [folders, setFolders] = useState([])

    // Checks if there is a change in the url, if so, it reloads the page
    // This is to make sure that the correct initialValue and initialTitle is loaded into the editor
    // Else the server will load the value one time and won't change it
    useEffect(() => {
        GetTask(), GetFoldersSupabase()
        const handleRouteChange = () => {
            location.reload()
        }

        router.events.on('routeChangeComplete', handleRouteChange)

        // If the component is unmounted, unsubscribe
        // from the event with the `off` method:
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [])

    useEffect(() => {
        if(task.title != undefined) {
            EditTask()
        }
    }, [task])

    if (session) {
        return (
            <div>
                <div className={creatingTask || editingTask ? styles.blur : null}>
                        <AppLayout>
                                <div className={styles.body}>
                                    <div className={openPanel ? `${styles.panel} ${styles.openFolderPanel}` : `${styles.panel} ${styles.closedFolderPanel}`}>
                                        <div className={`${styles.nav} ${styles.navMargin}`}>
                                            <button className={styles.mainButton} onClick={CreateTask}>
                                            <span className={styles.create}>Create </span>
                                            <span>+</span>
                                            </button>  
                                            <button className={openPanel ? `${styles.button} ${styles.openButton}` : styles.button} onClick={() => setOpenPanel(!openPanel)}>
                                                {openPanel ? "Close" : "Open"}
                                            </button>
                                        </div>
                                        <div className={styles.foldersContainer}>
                                            <hr className={styles.hr}></hr>
                                            <div style={{ margin: "15px" }}>
                                                <input className={`${styles.input} ${styles.folderInput}`}
                                                    id="title"
                                                    type="text"
                                                    name="folderTitle"
                                                    placeholder="Folder Title"
                                                    value={folderTitle}
                                                    required
                                                    onChange={(event) => setFolderTitle(event.target.value)}
                                                ></input>
                                                <button className={`${styles.mainButton} ${styles.createFolderMainButton}`} onClick={() => CreateFolderSupabase()}>Create Folder!</button>
                                            </div>
                                            <hr className={styles.hr}></hr>
                                            {folders.map((folder, i) => (
                                                <div key={i}>
                                                    <div>
                                                        <span>{folder.title}</span>
                                                        <button onClick={() => DiscardFolderSupabase(folder.id)}>x</button>
                                                    </div>
                                                    <div>

                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                                                    
                                <div className={styles.main}>
                                    <ListOfTasks reload={reload}></ListOfTasks>
                                </div>
                                <div className={AIPanel ? `${styles.panel} ${styles.openAIPanel}` : `${styles.panel} ${styles.closedAIPanel}`}>
                                        <div className={styles.navAI}>
                                            <button className={AIPanel ? `${styles.button} ${styles.AIButton} ${styles.openAIButton}` : `${styles.button} ${styles.AIButton}`} onClick={() => setAIPanel(!AIPanel)}>
                                                {AIPanel ? "Close" : "AI Assistance"}
                                            </button>
                                        </div>
                                        <div>
                                        </div>
                                    </div>
                                </div>
                        </AppLayout>
                </div>

                <div className={creatingTask || editingTask ? styles.taskForm : `${styles.hiddenTaskForm} ${styles.taskForm}`}>
                    <button className={styles.cancelButton} onClick={(CancelTask)}>x</button>
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
                        <select className={styles.select} onChange={(event) => setTaskPriority(event.target.value)}>
                            <option value="4">None</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                        <select className={styles.select} onChange={(event) => setFolderID(event.target.value)}>
                            <option value={null}>None</option>
                            {folders.map((folder, i) => (
                                <option key={i} value={folder.id}>{folder.title}</option>
                            ))}
                        </select>
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
}

export async function getServerSideProps({params}) {
    const {id} = params
    return {
        props: {
            taskID: id
        }
    }
}