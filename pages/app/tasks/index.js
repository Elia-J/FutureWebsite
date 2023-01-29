import React, { useEffect, useState, useCallback } from 'react'
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import styles from "/styles/task.module.scss"
import AppLayout from "/layouts/appLayout"
import ListOfTasks from "/components/listOfTasks"
import Image from 'next/image'
import { useRouter } from 'next/router'
import LoadingLine from '/components/loadingLine'
import Ai from "/components/ai"

export default function Tasks() {
    const session = useSession()
    const supabase = useSupabaseClient()
    const user = useUser()
    const router = useRouter()

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

    function HandleFolderPress(id) {
        if (selectedFolderID == id) {
            setSelectedFolderID(0)
        }
        else {GetFolderTasksSupabase(id)}
    }

    // Get all the tasks associated with a certain folder
    async function GetFolderTasksSupabase(id) {
            const {data, error} = await supabase
            .from('todos')
            .select('*')
            .eq('folder_id', id)
            if (data) {
                setFolderTasks(data)
                setSelectedFolderID(id)
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
            .insert({ user_id: user.id, title: folderTitle })
        GetFoldersSupabase()
        setFolderTitle("")
    }

    // Discards a folder in supabase
    async function DiscardFolderSupabase(id) {
        const { data, error } = await supabase
            .from('todosFolders')
            .delete()
            .eq('id', id)
        GetFoldersSupabase()
    }

    // Removes a task from a folder in supabase
    async function DiscardTaskFolderSupabase(id, folder_id) {
        const {data, error } = await supabase
            .from('todos')
            .update({ folder_id: null })
            .eq('id', id)
        GetFolderTasksSupabase(folder_id)
    }

    // Create a new task in supabase
    async function CreateTaskSupabase() {
        let nullDate = new Date(null)
        if (taskDate.getFullYear === nullDate.getFullYear && taskTime.getFullYear === nullDate.getFullYear) {
            const { data, error } = await supabase
                .from('todos')
                .insert({ user_id: user.id, title: taskTitle, date: null, time: null, description: taskDescription, priority: taskPriority, folder_id: folderID })
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
    function EditTask(task) {
        setTaskID(task.id)
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
        setTaskPriority(4)
        setCreatingTask(true)
        setReload(false)
    }

    function CancelTask() {
        setCreatingTask(false)
        setEditingTask(false)
        setReload(false)
    }

    // Function which figures out which sorter needs to be used for folders
    function FolderSorter(folders, sorter) {
        if (sorter == "AlphabeticalAscending") {
            AlphabeticalAscendingSorter(folders)
        }
        else if (sorter == "AlphabeticalDescending") {
            AlphabeticalDescendingSorter(folders)
        }
        else if(sorter == "CreatedAtAscending") {
            CreatedAtAscending(folders)
        }
        else if(sorter == "CreatedAtDescending") {
            CreatedAtDescending(folders)
        }
    }

    // Function that sorts all folders alphabetically in an ascending order (a-z)
    function AlphabeticalAscendingSorter(folders) {
        folders = folders.sort(function (folderX, folderY) {
            return folderX.title.localeCompare(folderY.title, { ignorePuncuation: true })
        })
    }

    // Function that sorts all folders alphabetically in a descending order (z-a)
    function AlphabeticalDescendingSorter(folders) {
        folders = folders.sort(function (folderX, folderY) {
            return folderY.title.localeCompare(folderX.title, { ignorePuncuation: true })
        })
    }

    // Function that sorts all the folders by date of creation in ascending order
    function CreatedAtAscending(folders) {
        folders = folders.sort(function (folderX, folderY) {
            console.log(folderX.created_at + folderY.created_at)
            if (folderX.created_at == folderY.created_at) {return 0}
            else if (folderX.created_at > folderY.created_at) {return 1}
            else {return -1}
        })
    }

    // Function that sorts all the folders by date of creation in ascending order
    function CreatedAtDescending(folders) {
        folders = folders.sort(function (folderX, folderY) {
            if (folderX.created_at == folderY.created_at) {return 0}
            else if (folderX.created_at > folderY.created_at) {return -1}
            else {return 1}
        })
    }

    const [creatingTask, setCreatingTask] = useState(false)
    const [editingTask, setEditingTask] = useState(false)
    const [reload, setReload] = useState(false)

    const [taskID, setTaskID] = useState(null)
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
    const [folderTasks, setFolderTasks] = useState([])
    const [selectedFolderID, setSelectedFolderID] = useState(0)
    const [folderSorter, setFolderSorter] = useState("AlphabeticalAscending")

    useEffect(() => {
        GetFoldersSupabase()
    }, [])

    const handleKeyPress = useCallback((event) => {
        if (event.key == "Escape" && (creatingTask || editingTask)) {
            CancelTask()
        }
        else if (event.key == "Escape" && openPanel) {
            setOpenPanel(false)
        }
        else if (event.key == "Escape" && AIPanel) {
            setAIPanel(false)
        }
        else if (event.key == "Delete" && creatingTask)
         {
            CancelTask()
         }
         else if (event.key == "Delete" && editingTask) {
            DiscardTaskSupabase()
         }
         else if (event.code == "Insert") {
            CreateTask()
         }
    })

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress)
    })

    FolderSorter(folders, folderSorter)
    if (session) {
        return (
            <div>
                <div className={creatingTask || editingTask ? styles.blur : null}>
                        <AppLayout>
                        <div className={styles.body}>
                                <div className={openPanel ? `${styles.panel} ${styles.openFolderPanel}` : `${styles.panel} ${styles.closedFolderPanel}`}>
                                    <div className={`${styles.nav} ${styles.navMargin}`}>
                                        <button className={AIPanel ? `${styles.mainButton} ${styles.createAIPanelOpen}` : styles.mainButton} onClick={CreateTask}>
                                        <span className={styles.create}>Create </span>
                                        <span>+</span>
                                        </button>  
                                        <button className={AIPanel ? styles.hidden : (openPanel ? `${styles.button} ${styles.openButton}` : styles.button)} onClick={() => setOpenPanel(!openPanel)}>
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
                                        <div className={styles.foldersNav}>
                                            <h2 className={styles.h2}>Folders</h2>
                                            <select className={styles.select} onChange={(event) => setFolderSorter(event.target.value)}>
                                                <option value="AlphabeticalAscending">Alphabetical (a-z)</option>
                                                <option value="AlphabeticalDescending">Alphabetical (z-a)</option>
                                                <option value="CreatedAtAscending">Created At (ascending)</option>
                                                <option value="CreatedAtDescending">Created At (descending)</option>
                                            </select>
                                        </div>
                                        {folders.map((folder, i) => (
                                            <div key={i}>
                                                <div className={styles.folderContainer}>
                                                    <div onClick={() => HandleFolderPress(folder.id)} className={selectedFolderID == folder.id ? `${styles.selectedFolderLabel} ${styles.folderLabel}` : styles.folderLabel}><Image alt="Folder" src="/rich-text-icons-dark/todoFolder.svg" width={25} height={25} /> {folder.title} </div>
                                                    <button onClick={() => DiscardFolderSupabase(folder.id)}><Image alt="Trashcan" src="/rich-text-icons-dark/trash.svg" width={25} height={25}/></button>
                                                </div>
                                                {selectedFolderID != folder.id ? null : 
                                                    <div style={{ marginBottom:20}}> 
                                                        {folderTasks.map((task, i) => (
                                                        <div key={i} className={styles.folderTaskContainer}>
                                                            <div onClick={() => router.push(`/app/tasks/${task.id}`)} className={styles.folderTaskLabel}><Image alt="Task" src="/rich-text-icons-dark/todo.svg" width={16} height={16}/> {task.title}</div>
                                                            <button onClick={() => DiscardTaskFolderSupabase(task.id, folder.id)}><Image alt="Trashcan" src="/rich-text-icons-dark/delete-folder.svg" width={19} height={19}/></button>
                                                        </div>
                                                    ))}
                                                    </div>
                                                } 
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                                                
                            <div className={styles.main}>
                                <ListOfTasks reload={reload}></ListOfTasks>
                            </div>

                            <div className={openPanel ? styles.hidden : (AIPanel ? `${styles.panel} ${styles.openAIPanel}` : `${styles.panel} ${styles.closedAIPanel}`)}>
                                    <div className={styles.navAI}>
                                        <button className={AIPanel ? `${styles.button} ${styles.AIButton} ${styles.openAIButton}` : `${styles.button} ${styles.AIButton}`} onClick={() => setAIPanel(!AIPanel)}>
                                            {AIPanel ? "Close" : "AI Assistance"}
                                        </button>
                                    </div>
                                    <div>
                                        <Ai type="tasks" />
                                    </div>
                                </div>
                            </div>
                    </AppLayout>
                </div>

                <div className={creatingTask || editingTask ? styles.taskForm : `${styles.hiddenTaskForm} ${styles.taskForm}`}>
                    <button className={styles.cancelButton} onClick={(CancelTask)}>x</button>
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
                    <div className={styles.flexContainer}>
                        <label style={{ marginRight: "35px" }} className={styles.label}>Priority</label>
                        <label style={{ marginLeft: "35px" }} className={styles.label}>Folder</label>
                    </div>
                    <div>
                        <div className={styles.flexContainer}>
                            <select style={{ marginLeft: "45px" }} className={`${styles.formSelect} ${styles.select}`} onChange={(event) => setTaskPriority(event.target.value)}>
                                <option value="4">None</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                            <select style={{ marginRight: "45px" }} className={`${styles.formSelect} ${styles.select}`} onChange={(event) => setFolderID(event.target.value)}>
                                <option value={"null"}>None</option>
                                {folders.map((folder, i) => (
                                    <option key={i} value={folder.id}>{folder.title}</option>
                                ))}
                            </select>
                        </div>
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
    else {
        return (
            <LoadingLine />
        )
    }
}