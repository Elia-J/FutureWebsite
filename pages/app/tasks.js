import React, { useEffect, useState } from 'react'
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import styles from "/styles/task.module.scss"
import Check from "/public/Check.svg"
import AppLayout from "/layouts/appLayout"
import { SettingsProvider } from "/layouts/stateStore"

export default function Tasks() {
    const session = useSession()
    const supabase = useSupabaseClient()
    const user = useUser()

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

        GetScheduledTasksSupabase()
        GetNonScheduledTasksSupabase()
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

        GetScheduledTasksSupabase()
        GetNonScheduledTasksSupabase()
        setEditingTask(false)
    }

    // Deletes a task in supabase
    async function DiscardTaskSupabase() {
        const { data, error } = await supabase
            .from('todos')
            .delete()
            .eq('id', taskID)
        setEditingTask(false)

        GetScheduledTasksSupabase()
        GetNonScheduledTasksSupabase()
    }

    // Function that changes the checked boolean from a given task to their opposite value
    async function CheckToggleSupabase(value, id) {
        const { data, error } = await supabase
            .from('todos')
            .update({ checked: value })
            .eq('id', id)

        GetScheduledTasksSupabase()
        GetNonScheduledTasksSupabase()
    }

    // Get all the scheduled tasks from supabase
    async function GetScheduledTasksSupabase() {
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .not("date", "is", "null")
        if (data) {
            setScheduledTasks(data)
        }
        if (error) {
            console.log('error', error)
            return
        }
    }

    // Get all the non-scheduled tasks from supabase
    async function GetNonScheduledTasksSupabase() {
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .is("date", "null")
        if (data) {
            setNonScheduledTasks(data)
        }
        if (error) {
            console.log('error', error)
            return
        }
    }

    // Function that resets all the states to their zero state and sets creatingTask to true
    function CreateTask() {
        setTaskTitle("")
        setTaskDate(new Date(null))
        setTaskTime(new Date(null))
        setTaskDescription("")
        setCreatingTask(true)
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
        setEditingTask(true)
    }

    function CancelTask() {
        setCreatingTask(false)
        setEditingTask(false)
    }

    // Function which figures out which sorter needs to be used
    function TasksSorter(tasks, sorter) {
        if (sorter == "AlphabeticalAscending") {
            AlphabeticalAscendingSorter(tasks)
        }
        else if (sorter == "AlphabeticalDescending") {
            AlphabeticalDescendingSorter(tasks)
        }
        else if (sorter == "DateAscending") {
            DateAscendingSorter(tasks)
        }
        else if (sorter == "DateDescending") {
            DateDescendingSorter(tasks)
        }
        CheckedSorter(tasks)
    }

    // Function that sorts all tasks alphabetically in an ascending order (a-z)
    function AlphabeticalAscendingSorter(tasks) {
        tasks = tasks.sort(function (taskX, taskY) {
            return taskX.title.localeCompare(taskY.title, { ignorePuncuation: true })
        })
    }

    // Function that sorts all tasks alphabetically in a descending order (z-a)
    function AlphabeticalDescendingSorter(tasks) {
        tasks = tasks.sort(function (taskX, taskY) {
            return taskY.title.localeCompare(taskX.title, { ignorePuncuation: true })
        })
    }

    // Function that sorts all tasks by date and then time in an ascending order (0-10)
    function DateAscendingSorter(tasks) {
        tasks = tasks.sort(function (taskX, taskY) {
            if (taskX.date == taskY.date) { return 0 }
            else if (taskX.date > taskY.date) { return 1 }
            else { return -1 }
        })
        tasks = tasks.sort(function (taskX, taskY) {
            if (taskX.time == taskY.time || taskX.date != taskY.date) { return 0 }
            else if (taskX.time > taskY.time) { return 1 }
            else { return -1 }
        })
    }

    // Function that sorts all tasks by date and then time in a descending order (10-0)
    function DateDescendingSorter(tasks) {
        tasks = tasks.sort(function (taskX, taskY) {
            if (taskX.date == taskY.date) { return 0 }
            else if (taskX.date < taskY.date) { return 1 }
            else { return -1 }
        })
        tasks = tasks.sort(function (taskX, taskY) {
            if (taskX.time == taskY.time || taskX.date != taskY.date) { return 0 }
            else if (taskX.time < taskY.time) { return 1 }
            else { return -1 }
        })
    }

    // Function that moves all checked tasks to the end of the tasks array
    function CheckedSorter(tasks) {
        tasks = tasks.sort(function (taskX, taskY) {
            if (taskX.checked == taskY.checked) { return 0 }
            else if (taskX.checked) { return 1 }
            else { return -1 }
        })
    }

    // Function that returns either all scheduled tasks or a text indicating that there are currently no scheduled tasks
    function ScheduledTasks(tasks) {
        if (tasks.length == 0) {
            return <h3 className={styles.h3}>You currently don&apos;t have any scheduled tasks</h3>
        }
        return (tasks.map((task, i) => (
            <section key={i} className={task.checked ? `${styles.taskChecked} ${styles.task}` : styles.task}>
                <div className={styles.leftTaskpart} >
                    <button className={task.checked ? `${styles.taskCheckBoxChecked} ${styles.taskCheckBox}` : styles.taskCheckBox} onClick={() => CheckToggleSupabase(!task.checked, task.id)}>
                        <Check className={task.checked ? null : styles.hidden} />
                    </button>
                    <span className={styles.lineWrap}>
                        <span className={task.checked ? `${styles.lineChecked} ${styles.line}` : styles.line}></span>
                        <span className={styles.taskName} onClick={() => EditTask(task)}>{task.title}</span>
                    </span>
                </div>
                <span className={styles.taskDate}>{task.date}</span>
            </section>
        )))
    }

    // Function that returns either all non-scheduled tasks or a text indicating that there are currently no non-scheduled tasks
    function NonScheduledTasks(tasks) {
        if (tasks.length == 0) {
            return <h3 className={styles.h3}>You currently don&apos;t have any non-scheduled tasks</h3>
        }
        return (tasks.map((task, i) => (
            <section key={i} className={task.checked ? `${styles.taskChecked} ${styles.task}` : styles.task}>
                <div className={styles.leftTaskpart} >
                    <button className={task.checked ? `${styles.taskCheckBoxChecked} ${styles.taskCheckBox}` : styles.taskCheckBox} onClick={() => CheckToggleSupabase(!task.checked, task.id)}>
                        <Check className={task.checked ? null : styles.hidden} />
                    </button>
                    <span className={styles.lineWrap}>
                        <span className={task.checked ? `${styles.lineChecked} ${styles.line}` : styles.line}></span>
                        <span className={styles.taskName} onClick={() => EditTask(task)}>{task.title}</span>
                    </span>
                </div>
            </section>
        )))
    }

    const [scheduledTasks, setScheduledTasks] = useState([])
    const [nonScheduledTasks, setNonScheduledTasks] = useState([])

    const [creatingTask, setCreatingTask] = useState(false)
    const [editingTask, setEditingTask] = useState(false)
    const [scheduledSorter, setScheduledSorter] = useState("AlphabeticalAscending")
    const [nonScheduledSorter, setNonScheduledSorter] = useState("AlphabeticalAscending")

    const [taskID, setTaskID] = useState(null)
    const [taskTitle, setTaskTitle] = useState("")
    const [taskDate, setTaskDate] = useState(new Date(null))
    const [taskTime, setTaskTime] = useState(new Date(null))
    const [taskDescription, setTaskDescription] = useState("")

    useEffect(() => {
        GetScheduledTasksSupabase(), GetNonScheduledTasksSupabase()
    }, [])
    TasksSorter(scheduledTasks, scheduledSorter)
    TasksSorter(nonScheduledTasks, nonScheduledSorter)
    if (session) {
        return (
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

                                <main className={styles.mainContainer}>
                                    <div className={styles.tasksContainer}>
                                        <div className={styles.comboBoxAndH3Container}>
                                            <h2 className={styles.h2}>Scheduled</h2>
                                            <select className={styles.select} onChange={(event) => setScheduledSorter(event.target.value)}>
                                                <option value="AlphabeticalAscending">Alphabetical (a-z)</option>
                                                <option value="AlphabeticalDescending">Alphabetical (z-a)</option>
                                                <option value="DateAscending">Date Ascending</option>
                                                <option value="DateDescending">Date Descending</option>
                                            </select>
                                        </div>
                                        <hr className={styles.hr}></hr>
                                        {ScheduledTasks(scheduledTasks)}
                                    </div>
                                    <div className={styles.tasksContainer}>
                                        <div className={styles.comboBoxAndH3Container}>
                                            <h2 className={styles.h2}>Not Scheduled</h2>
                                            <select className={styles.select} onChange={(event) => setNonScheduledSorter(event.target.value)}>
                                                <option value="AlphabeticalAscending">Alphabetical (a-z)</option>
                                                <option value="AlphabeticalDescending">Alphabetical (z-a)</option>
                                            </select>
                                        </div>
                                        <hr className={styles.hr}></hr>
                                        {NonScheduledTasks(nonScheduledTasks)}
                                    </div>
                                </main>
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
}