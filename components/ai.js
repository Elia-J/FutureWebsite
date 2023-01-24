import React, { useEffect, useState } from 'react'
import styles from '../styles/ai.module.scss'
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import toast, { Toaster } from 'react-hot-toast';
import { CopyToClipboard } from 'react-copy-to-clipboard';



export default function AuseStatei({ type }) {
    //supabase
    const supabase = useSupabaseClient()
    const session = useSession()
    const user = useUser()

    const [notesAIinput, setNotesAIinput] = useState('')
    const [notesData, setNotesData] = useState("")
    const [loadingNotes, setLoadingNotes] = useState(false)

    async function handleNotesGenerate(e) {
        e.preventDefault()
        setLoadingNotes(true)
        const response = await fetch('/api/aiNotes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                key: process.env.NEXT_PUBLIC_API_SECRET_KEY,
                prompt: notesAIinput
            })
        })
        const data = await response.json()
        setNotesData(data.choices[0].text)
        setLoadingNotes(false)
    }
    console.log(notesData)

    //Tasks
    const [tasksAIinput, setTasksAIinput] = useState('')
    const [tasksData, setTasksData] = useState([])
    const [loadingTasks, setLoadingTasks] = useState(false)

    async function handleTasksGenerate(e) {
        e.preventDefault()
        setLoadingTasks(true)
        const response = await fetch('/api/aiTasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                key: process.env.NEXT_PUBLIC_API_SECRET_KEY,
                prompt: tasksAIinput
            })
        })
        const data = await response.json()
        fromStringToArray(data.choices[0].text)
        setLoadingTasks(false)
    }

    function fromStringToArray(string) {
        const array = string.split('\n')

        const modifiedArray = array
            .filter((item) => item !== '')

        setTasksData(modifiedArray)
    }

    async function handleTasksAdd(task) {
        const { data, error } = await supabase
            .from('todos')
            .insert([
                { title: task, user_id: user.id }
            ])
        if (error) {
            console.log(error)
        }
        else {
            toast.success('Task added', {
                iconTheme: {
                    primary: '#4C7987',
                    secondary: '#ffffff',
                }
            });
        }
    }




    if (type === 'tasks') {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Tasks AI Assistance</h1>
                <form className={styles.form} onSubmit={handleTasksGenerate}>
                    <textarea type="text" value={tasksAIinput} onChange={e => setTasksAIinput(e.target.value)} className={styles.textareaAI}
                        placeholder="Enter a thing you want to do and the AI will generate a list of tasks for you like: 'I want to go to the gym'"
                        minLength="10"
                        required
                        rows="10"
                    />
                    <button type="submit" className={styles.generateButton}>
                        Generate
                        {loadingTasks && <div className={styles.loader}>
                            &#160; Loading
                        </div>}

                    </button>
                </form>
                <div className={styles.view}>
                    <div className={styles.content}>
                        {tasksData.map((task, index) => {
                            return (
                                <div className={styles.task} key={index}>
                                    <div className={styles.taskText}>{task.slice(2)}</div>
                                    <button className={styles.taskButton}
                                        onClick={() => handleTasksAdd(task.slice(2))}

                                    >
                                        Add
                                    </button>
                                </div>)
                        })
                        }

                    </div>
                </div>
                <Toaster
                    position="bottom-right"
                    reverseOrder={false}
                    theme="auto"

                />
            </div >
        )
    }
    else if (type === 'notes') {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Notes AI Assistance</h1>
                <form className={styles.form} onSubmit={handleNotesGenerate}>
                    <textarea type="text" value={notesAIinput} onChange={e => setNotesAIinput(e.target.value)} className={styles.textareaAI}
                        placeholder="Enter a thing you want to know more about, begin your sentence with 'how to', 'what is' or 'explain' like: 'What is logic in computer science'"
                        minLength="10"
                        required
                        rows="10"
                    />
                    <button type="submit" className={styles.generateButton}>
                        Generate
                        {loadingNotes && <div className={styles.loader}>
                            &#160; Loading
                        </div>}

                    </button>
                </form>
                < CopyToClipboard text={notesData}
                    onCopy={() => toast.success('Copied to clipboard', {
                        iconTheme: {
                            primary: '#4C7987',
                            secondary: '#ffffff',
                        }
                    })}>
                    <button className={styles.copyButton}>Copy</button>
                </CopyToClipboard>
                <div className={styles.view}>
                    <div className={styles.content}>
                        {notesData}
                    </div>
                </div>

                <Toaster
                    position="bottom-right"
                    reverseOrder={false}
                    theme="auto"

                />

            </div>
        )
    }
}
