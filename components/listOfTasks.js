import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import styles from "/styles/task.module.scss"
import Check from "/public/Check.svg"
import Image from 'next/image'
import { useStateStoreContext } from "/layouts/stateStore"

export default function ListOfTasks({reload}) {
    const supabase = useSupabaseClient()
    const [showSettings, setShowSettings, shortcutsPanel, setShortcutsPanel, settings, setSettings, saveButton, setSaveButton, settingsCopy, setSettingsCopy] = useStateStoreContext();

    // Function that changes the checked boolean from a given task to their opposite value
    async function CheckToggleSupabase(value, id) {
        const { data, error } = await supabase
            .from('todos')
            .update({ checked: value })
            .eq('id', id)

        GetTasks()
    }

    // Function that changes the expanded boolean from a given task to their opposite value
    async function UpdateExpandedSupabase(value, id) {
        const { data, error } = await supabase
            .from('todos')
            .update({ expanded: value })
            .eq('id', id)

        GetTasks()
    }

    // Get all the tasks from supabase
    async function GetTasks() {
        const { data, error } = await supabase
            .from('todos')
            .select('*')
        if (data) {
            setTasks(data)
        }
        if (error) {
            console.log('error', error)
            return
        }
    }

    // Get all the selected tasks
    function GetSelectedTasks(tasks, selecter) {
        let selectedTasksList = []
        if (selecter == "All") {
            setSelectedTasks(tasks)
        }
        else if (selecter == "Scheduled") {
            tasks.map(function (task, i) {
                if(task.date != null) {
                    selectedTasksList.push(task)
                }
            })
            setSelectedTasks(selectedTasksList)
        }
        else if (selecter == "NonScheduled") {
            tasks.map(function (task, i) {
                if(task.date == null) {
                    selectedTasksList.push(task)
                }
            })
            setSelectedTasks(selectedTasksList)
        }
        else if (selecter == "Completed") {
            tasks.map(function (task) {
                if(task.checked) {
                    selectedTasksList.push(task)
                }
            })
            setSelectedTasks(selectedTasksList)
        }
    }

    // Function which figures out which sorter needs to be used
    function TasksSorter(selectedTasks, sorter) {
        if (sorter == "AlphabeticalAscending") {
            AlphabeticalAscendingSorter(selectedTasks)
        }
        else if (sorter == "AlphabeticalDescending") {
            AlphabeticalDescendingSorter(selectedTasks)
        }
        else if (sorter == "DateAscending") {
            DateAscendingSorter(selectedTasks)
        }
        else if (sorter == "DateDescending") {
            DateDescendingSorter(selectedTasks)
        }
        else if (sorter == "TimeAscending") {
            TimeAscendingSorter(selectedTasks)
        }
        else if(sorter == "TimeDescending") {
            TimeDescendingSorter(selectedTasks)
        }
        else if(sorter == "PriorityAscending") {
            PriorityAscending(selectedTasks)
        }
        else if(sorter == "PriorityDescending") {
            PriorityDescending(selectedTasks)
        }
        else if(sorter == "CreatedAtAscending") {
            CreatedAtAscending(selectedTasks)
        }
        else if(sorter == "CreatedAtDescending") {
            CreatedAtDescending(selectedTasks)
        }
        CheckedSorter(selectedTasks)
    }

    // Function that sorts all selectedTasks alphabetically in an ascending order (a-z)
    function AlphabeticalAscendingSorter(selectedTasks) {
        selectedTasks = selectedTasks.sort(function (taskX, taskY) {
            return taskX.title.localeCompare(taskY.title, { ignorePuncuation: true })
        })
    }

    // Function that sorts all selectedTasks alphabetically in a descending order (z-a)
    function AlphabeticalDescendingSorter(selectedTasks) {
        selectedTasks = selectedTasks.sort(function (taskX, taskY) {
            return taskY.title.localeCompare(taskX.title, { ignorePuncuation: true })
        })
    }

    // Function that sorts all selectedTasks by date and then time in an ascending order (0-10)
    function DateAscendingSorter(selectedTasks) {
        selectedTasks = selectedTasks.sort(function (taskX, taskY) {
            if (taskX.date == taskY.date) { return 0 }
            else if (taskX.date > taskY.date) { return 1 }
            else { return -1 }
        })
        selectedTasks = selectedTasks.sort(function (taskX, taskY) {
            if (taskX.time == taskY.time || taskX.date != taskY.date) { return 0 }
            else if (taskX.time > taskY.time) { return 1 }
            else { return -1 }
        })
    }

    // Function that sorts all selectedTasks by date and then time in a descending order (10-0)
    function DateDescendingSorter(selectedTasks) {
        selectedTasks = selectedTasks.sort(function (taskX, taskY) {
            if (taskX.date == taskY.date) { return 0 }
            else if (taskX.date < taskY.date) { return 1 }
            else { return -1 }
        })
        selectedTasks = selectedTasks.sort(function (taskX, taskY) {
            if (taskX.time == taskY.time || taskX.date != taskY.date) { return 0 }
            else if (taskX.time < taskY.time) { return 1 }
            else { return -1 }
        })
    }

    // Function that sorts all selectedTasks by time and then date in an ascending order (0-10)
    function TimeAscendingSorter(selectedTasks) {
        selectedTasks = selectedTasks.sort(function (taskX, taskY) {
            if (taskX.time == taskY.time) { return 0 }
            else if (taskX.time > taskY.time) { return 1 }
            else { return -1 }
        })
        selectedTasks = selectedTasks.sort(function (taskX, taskY) {
            if (taskX.date == taskY.date || taskX.time != taskY.time) { return 0 }
            else if (taskX.date > taskY.date) { return 1 }
            else { return -1 }
        })
    }

    // Function that sorts all selectedTasks by time and then date in an descending order (10-0)
    function TimeDescendingSorter(selectedTasks) {
        selectedTasks = selectedTasks.sort(function (taskX, taskY) {
            if (taskX.time == taskY.time) { return 0 }
            else if (taskX.time < taskY.time) { return 1 }
            else { return -1 }
        })
        selectedTasks = selectedTasks.sort(function (taskX, taskY) {
            if (taskX.date == taskY.date || taskX.time != taskY.time) { return 0 }
            else if (taskX.date < taskY.date) { return 1 }
            else { return -1 }
        })
    }

    // Function that sorts all selectedTasks by priorty in ascending order (1-3)
    function PriorityAscending(selectedTasks) {
        selectedTasks = selectedTasks.sort(function (taskX, taskY) {
            if (taskX.priority == taskY.priority) { return 0 }
            else if (taskX.priority > taskY.priority) { return 1 }
            else {return -1}
        })
    }

    // Function that sorts all selectedTasks by priorty in descending order (3-1)
    function PriorityDescending(selectedTasks) {
        selectedTasks = selectedTasks.sort(function (taskX, taskY) {
            if (taskX.priority == taskY.priority) { return 0 }
            else if (taskX.priority < taskY.priority) { return 1 }
            else {return -1}
        })
    }

    // Function that sorts all selectedTasks by date of creation in ascending order
    function CreatedAtAscending(selectedTasks) {
        selectedTasks = selectedTasks.sort(function (taskX, taskY) {
            console.log(taskX.created_at + taskY.created_at)
            if (taskX.created_at == taskY.created_at) {return 0}
            else if (taskX.created_at > taskY.created_at) {return 1}
            else {return -1}
        })
    }

    // Function that sorts all selectedTasks by date of creation in ascending order
    function CreatedAtDescending(selectedTasks) {
        selectedTasks = selectedTasks.sort(function (taskX, taskY) {
            if (taskX.created_at == taskY.created_at) {return 0}
            else if (taskX.created_at > taskY.created_at) {return -1}
            else {return 1}
        })
    }

    // Function that moves all checked selectedTasks to the end of the selectedTasks array
    // Or a function that removes all checked selectedTasks from the database if removeCheckedTasks is activated via the usersettings
    function CheckedSorter(selectedTasks) {
        if(settings.removeCheckedTasks) {
            let numRemovedTasks = 0
            selectedTasks.map((task) => (
                task.checked ? DiscardTask(task) && numRemovedTasks++ : null
            ))
            if(numRemovedTasks != 0) {
                GetTasks()
            }
        }
        else {
            selectedTasks = selectedTasks.sort(function (taskX, taskY) {
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

    // Function that returns either all scheduled tasks or a text indicating that there are currently no tasks
    function Tasks(selectedTasks) {
        if (selectedTasks.length == 0) {
            return <h3 className={styles.h3}>You currently don&apos;t have any tasks</h3>
        }
        return (selectedTasks.map((task, i) => (
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
                        <span className={styles.taskDate}>{settings.showTimeForTasks ? task.time : task.date}</span>
                        <span className={styles.operatorSign} onClick={() => UpdateExpandedSupabase(!task.expanded, task.id)}>{task.expanded ? '-' : '+'}</span>
                    </div>
                </div>
                <div className={task.expanded ? (task.checked ? `${styles.taskExtension} ${styles.taskChecked} ${styles.task}` : `${styles.taskExtension} ${styles.task}`) : styles.taskCollapsed}>
                    <span className={styles.taskDescription}>{task.description}</span>
                    <span className={`${styles.taskExtendedDate} ${styles.taskDate}`}>{settings.showTimeForTasks ? task.date : task.time}</span>
                </div>
            </section>
        )))
    }

    const [tasks, setTasks] = useState([])
    const [selectedTasks, setSelectedTasks] = useState([])
    const [selecter, setSelecter] = useState("All")
    const [sorter, setSorter] = useState("AlphabeticalAscending")

    useEffect(() => {
        GetTasks()
    }, [reload])

    useEffect(() => {
        GetSelectedTasks(tasks, selecter)
    }, [selecter, tasks])
    
    TasksSorter(selectedTasks, sorter)
    return(
        <main className={styles.mainContainer}>
            <div className={styles.selecterContainer}>
                <button className={selecter == "All" ? `${styles.selecterButton} ${styles.selecterButtonSelected}` : styles.selecterButton} 
                onClick={(event) => setSelecter("All")}>
                All <Image className={selecter == "All" ? styles.whiteSort : null} alt="sort" src="/sort.svg" width={25} height={25}/></button>
                <button className={selecter == "Scheduled" ? `${styles.selecterButton} ${styles.selecterButtonSelected}` : styles.selecterButton} 
                onClick={(event) => setSelecter("Scheduled")}>
                Scheduled <Image className={selecter == "Scheduled" ? styles.whiteSort : null} alt="sort" src="/sort.svg" width={25} height={25}/></button>
                <button className={selecter == "NonScheduled" ? `${styles.selecterButton} ${styles.selecterButtonSelected}` : styles.selecterButton} 
                onClick={(event) => setSelecter("NonScheduled")}>
                Not Scheduled <Image className={selecter == "NonScheduled" ? styles.whiteSort : null} alt="sort" src="/sort.svg" width={25} height={25}/></button>
                <button className={selecter == "Completed" ? `${styles.selecterButton} ${styles.selecterButtonSelected}` : styles.selecterButton} 
                onClick={(event) => setSelecter("Completed")}>
                Completed <Image className={selecter == "Completed" ? styles.whiteSort : null} alt="sort" src="/sort.svg" width={25} height={25}/></button>
            </div>
            <div className={styles.tasksContainer}>
                <div className={styles.comboBoxAndH3Container}>
                    <h2 className={styles.h2}>Tasks</h2>
                    <select className={styles.select} onChange={(event) => setSorter(event.target.value)}>
                        <option value="AlphabeticalAscending">Alphabetical (a-z)</option>
                        <option value="AlphabeticalDescending">Alphabetical (z-a)</option>
                        <option value="DateAscending">Date (ascending)</option>
                        <option value="DateDescending">Date (descending)</option>
                        <option value="TimeAscending">Time (ascending)</option>
                        <option value="TimeDescending">Time (descending)</option>
                        <option value="PriorityAscending">Priority (ascending)</option>
                        <option value="PriorityDescending">Priority (descending)</option>
                        <option value="CreatedAtAscending">Created At (ascending)</option>
                        <option value="CreatedAtDescending">Created At (descending)</option>
                    </select>
                </div>
                <hr className={styles.hr}></hr>
                {Tasks(selectedTasks)}
            </div>
        </main>
    )
}