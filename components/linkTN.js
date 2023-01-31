import React, { useState, useEffect } from 'react'
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import Link from 'next/link'
import styles from '/styles/linkTN.module.scss'
import CloseIcon from "/public/close.svg"
//This is a simple test page to test the search function.

export default function Search({ id, user_id }) {
    const [input, setInput] = useState('')


    const [dataTasks, setDataTasks] = useState([])
    const [previewTask, setPreviewTask] = useState([])

    //supabase
    const supabase = useSupabaseClient()

    async function preview1(eventId) {
        const { data, error } = await supabase
            //from bothe todos table and notesv2 table
            .from('todos')
            .select('id , title , nameTable , linkedEventId')
            .eq('linkedEventId', eventId)

        setPreviewTask(data)
    }

    async function search() {
        const { data: tasksData, error: tasksError } = await supabase
            .from('todos')
            .select('id , title , nameTable , linkedEventId')
            .eq('linkedEventId', 0)
            .ilike('title', `%${input}%`)


        if (tasksError) console.log('error', tasksError)
        if (tasksData) {
            setDataTasks(tasksData)
        }
    }

    const data = dataTasks

    async function link(taskOrNoteId, nameTable) {
        console.log("taskOrNoteId")
        if (nameTable === 'todo') {
            const { data, error } = await supabase
                .from('todos')
                .update({ linkedEventId: id })
                .eq('id', taskOrNoteId)
            if (error) console.log('error', error)
            else {
                search()
                preview1(id)
            }
        }
    }

    async function unLink(taskOrNoteId, nameTable) {
        if (nameTable === 'todo') {
            const { data, error } = await supabase
                .from('todos')
                .update({ linkedEventId: 0 })
                .eq('id', taskOrNoteId)
            if (error) console.log('error', error)
            else {
                search()
                preview1(id)
            }
        }

    }



    useEffect(() => {
        search()
        preview1(id)
    }, [])

    useEffect(() => {
        preview1(id)
    }, [id])





    useEffect(() => {

        const timer = setTimeout(() => {
            search()
        }, 100);

        return () => clearTimeout(timer);

    }, [input])

    return (
        <div>

            <h4 className={styles.linkedTasksTitle}>
                Linked Tasks
            </h4>
            <div className={styles.linkContainer}>

                {previewTask == "" &&
                    <div className={styles.link}>
                        No linked tasks
                    </div>
                }

                {previewTask != null &&

                    previewTask.map((item, index) => (
                        <div key={index} className={styles.link}>
                            <Link href={`/app/tasks/${item.id}`}>

                                {item.title}
                            </Link>

                            <button onClick={
                                () => {
                                    unLink(item.id, item.nameTable)
                                }
                            }
                                className={styles.unLinkButton}
                            >
                                <CloseIcon />
                            </button>

                        </div>
                    ))
                }
            </div>

            <input type="text" value={input} onChange={e => setInput(e.target.value)}
                placeholder="Search for tasks"
                className={styles.searchInput}

            />
            <div className={styles.linkContainer2}>
                <div className={styles.subContainer}>
                    {data.map((item, index) => (
                        <div key={index} className={styles.toLink}>
                            {item.title}
                            <button onClick={
                                () => {
                                    link(item.id, item.nameTable)
                                    search()
                                }

                            }
                                className={styles.linkButton}
                            >Link</button>

                        </div>
                    ))}

                </div>
            </div>

        </div>
    )
}