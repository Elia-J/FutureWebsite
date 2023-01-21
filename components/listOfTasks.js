import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import styles from "/styles/task.module.scss"
import Check from "/public/Check.svg"

export default function ListOfTasks({reload}) {
    const session = useSession()
    const supabase = useSupabaseClient()
    const user = useUser()

    //Get the usersettings from database on page load
    async function GetUserSettings() {
        const { data, error } = await supabase
            .from('profiles')
            .select(`removeCheckedTasks, showTimeForTasks`)
            .eq('id', user.id)
            .single()

        if (error) {
            console.log(error)
        }
        if (data) {
            setRemoveCheckedTasks(data.removeCheckedTasks)
            setShowTimeForTasks(data.showTimeForTasks)
        }
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

    // Function that changes the expanded boolean from a given task to their opposite value
    async function UpdateExpandedSupabase(value, id) {
        const { data, error } = await supabase
            .from('todos')
            .update({ expanded: value })
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
        else if (sorter == "TimeAscending") {
            TimeAscendingSorter(tasks)
        }
        else if(sorter == "TimeDescending") {
            TimeDescendingSorter(tasks)
        }
        else if(sorter == "PriorityAscending") {
            PriorityAscending(tasks)
        }
        else if(sorter == "PriorityDescending") {
            PriorityDescending(tasks)
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

    // Function that sorts all tasks by time and then date in an ascending order (0-10)
    function TimeAscendingSorter(tasks) {
        tasks = tasks.sort(function (taskX, taskY) {
            if (taskX.time == taskY.time) { return 0 }
            else if (taskX.time > taskY.time) { return 1 }
            else { return -1 }
        })
        tasks = tasks.sort(function (taskX, taskY) {
            if (taskX.date == taskY.date || taskX.time != taskY.time) { return 0 }
            else if (taskX.date > taskY.date) { return 1 }
            else { return -1 }
        })
    }

    // Function that sorts all tasks by time and then date in an descending order (10-0)
    function TimeDescendingSorter(tasks) {
        tasks = tasks.sort(function (taskX, taskY) {
            if (taskX.time == taskY.time) { return 0 }
            else if (taskX.time < taskY.time) { return 1 }
            else { return -1 }
        })
        tasks = tasks.sort(function (taskX, taskY) {
            if (taskX.date == taskY.date || taskX.time != taskY.time) { return 0 }
            else if (taskX.date < taskY.date) { return 1 }
            else { return -1 }
        })
    }

    // Function that sorts all tasks by priorty in ascending order (1-3)
    function PriorityAscending(tasks) {
        tasks = tasks.sort(function (taskX, taskY) {
            if (taskX.priority == taskY.priority) { return 0 }
            else if (taskX.priority > taskY.priority) { return 1 }
            else {return -1}
        })
    }

    // Function that sorts all tasks by priorty in descending order (3-1)
    function PriorityDescending(tasks) {
        tasks = tasks.sort(function (taskX, taskY) {
            if (taskX.priority == taskY.priority) { return 0 }
            else if (taskX.priority < taskY.priority) { return 1 }
            else {return -1}
        })
    }

    // Function that moves all checked tasks to the end of the tasks array
    // Or a function that removes all checked tasks from the database if removeCheckedTasks is activated via the usersettings
    function CheckedSorter(tasks) {
        if(removeCheckedTasks) {
            let numRemovedTasks = 0
            tasks.map((task) => (
                task.checked ? DiscardTask(task) && numRemovedTasks++ : null
            ))
            if(numRemovedTasks != 0) {
                GetScheduledTasksSupabase()
                GetNonScheduledTasksSupabase()
            }
        }
        else {
            tasks = tasks.sort(function (taskX, taskY) {
                if (taskX.checked == taskY.checked) { return 0 }
                else if (taskX.checked) { return 1 }
                else { return -1 }
            })
        }
    }

    // Function that deletes a task from supabase
    async function DiscardTask(task) {
        const { data, error } = await supabase
            .from('todos')
            .delete()
            .eq('id', task.id)
    }

    // Function that returns either all scheduled tasks or a text indicating that there are currently no scheduled tasks
    function ScheduledTasks(tasks) {
        if (tasks.length == 0) {
            return <h3 className={styles.h3}>You currently don&apos;t have any scheduled tasks</h3>
        }
        return (tasks.map((task, i) => (
            <section key={i}>
                <div className={task.expanded ? (task.checked ? `${styles.taskChecked} ${styles.taskExtended} ${styles.task}` : `${styles.taskExtended} ${styles.task}`) : (task.checked ? `${styles.taskChecked} ${styles.task}` : styles.task)}>
                    <div className={styles.taskPart} >
                        <button className={task.checked ? `${styles.taskCheckBoxChecked} ${styles.taskCheckBox}` : 
                        (task.priority == 4 ? styles.taskCheckBox : (task.priority == 1 ? `${styles.taskCheckBox1} ${styles.taskCheckBox}` : (task.priority == 2 ? `${styles.taskCheckBox2} ${styles.taskCheckBox}` : `${styles.taskCheckBox3} ${styles.taskCheckBox}`)))} 
                        onClick={() => CheckToggleSupabase(!task.checked, task.id)}>
                            <Check className={task.checked ? null : styles.hidden} />
                        </button>
                        <span className={styles.lineWrap}>
                            <span className={task.checked ? `${styles.lineChecked} ${styles.line}` : styles.line}></span>
                            <Link className={styles.taskName} href={`/app/tasks/${task.id}`}>
                                {task.title}
                            </Link>
                        </span>
                    </div>
                    <div className={styles.taskPart}>
                        <span className={styles.taskDate}>{showTimeForTasks ? task.time : task.date}</span>
                        <span className={styles.operatorSign} onClick={() => UpdateExpandedSupabase(!task.expanded, task.id)}>{task.expanded ? '-' : '+'}</span>
                    </div>
                </div>
                <div className={task.expanded ? (task.checked ? `${styles.taskExtension} ${styles.taskChecked} ${styles.task}` : `${styles.taskExtension} ${styles.task}`) : styles.taskCollapsed}>
                    <span className={styles.taskDescription}>{task.description}</span>
                    <span className={`${styles.taskExtendedDate} ${styles.taskDate}`}>{showTimeForTasks ? task.date : task.time}</span>
                </div>
            </section>
        )))
    }

    // Function that returns either all non-scheduled tasks or a text indicating that there are currently no non-scheduled tasks
    function NonScheduledTasks(tasks) {
        if (tasks.length == 0) {
            return <h3 className={styles.h3}>You currently don&apos;t have any non-scheduled tasks</h3>
        }
        return (tasks.map((task, i) => 
        (
            <section key={i}>
                <div className={task.checked ? `${styles.taskChecked} ${styles.task}` : styles.task}>
                    <div className={styles.taskPart} >
                        <button className={task.checked ? `${styles.taskCheckBoxChecked} ${styles.taskCheckBox}` : styles.taskCheckBox} onClick={() => CheckToggleSupabase(!task.checked, task.id)}>
                            <Check className={task.checked ? null : styles.hidden} />
                        </button>
                        <span className={styles.lineWrap}>
                            <span className={task.checked ? `${styles.lineChecked} ${styles.line}` : styles.line}></span>
                            <Link className={styles.taskName} href={`/app/tasks/${task.id}`}>
                                {task.title}
                            </Link>
                        </span>
                    </div>
                    <div className={styles.taskPart}>
                    <span className={styles.taskDate}>{showTimeForTasks ? task.time : null}</span>                        
                    <span className={styles.operatorSign} onClick={() => UpdateExpandedSupabase(!task.expanded, task.id)}>{task.expanded ? '-' : '+'}</span>
                    </div>
                </div>
                <div className={task.expanded ? styles.task : styles.hidden}>
                </div>
            </section>
        )))
    }

    const [scheduledTasks, setScheduledTasks] = useState([])
    const [nonScheduledTasks, setNonScheduledTasks] = useState([])
    const [scheduledSorter, setScheduledSorter] = useState("AlphabeticalAscending")
    const [nonScheduledSorter, setNonScheduledSorter] = useState("AlphabeticalAscending")
    const [removeCheckedTasks, setRemoveCheckedTasks] = useState(null)
    const [showTimeForTasks, setShowTimeForTasks] = useState(null)

    useEffect(() => {
        GetScheduledTasksSupabase(), GetNonScheduledTasksSupabase(), GetUserSettings()
    }, [reload])

    TasksSorter(scheduledTasks, scheduledSorter)
    TasksSorter(nonScheduledTasks, nonScheduledSorter)

    return(
        <main className={styles.mainContainer}>
                                    <div className={styles.tasksContainer}>
                                        <div className={styles.comboBoxAndH3Container}>
                                            <h2 className={styles.h2}>Scheduled</h2>
                                            <select className={styles.select} onChange={(event) => setScheduledSorter(event.target.value)}>
                                                <option value="AlphabeticalAscending">Alphabetical (a-z)</option>
                                                <option value="AlphabeticalDescending">Alphabetical (z-a)</option>
                                                <option value="DateAscending">Date Ascending</option>
                                                <option value="DateDescending">Date Descending</option>
                                                <option value="TimeAscending">Time Ascending</option>
                                                <option value="TimeDescending">Time Descending</option>
                                                <option value="PriorityAscending">Priority Ascending</option>
                                                <option value="PriorityDescending">Priority Descending</option>
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
                                                <option value="TimeAscending">Time Ascending</option>
                                                <option value="TimeDescending">Time Descending</option>
                                                <option value="PriorityAscending">Priority Ascending</option>
                                                <option value="PriorityDescending">Priority Descending</option>
                                            </select>
                                        </div>
                                        <hr className={styles.hr}></hr>
                                        {NonScheduledTasks(nonScheduledTasks)}
                                    </div>
                                </main>
    )
}