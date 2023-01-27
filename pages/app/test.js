import React, { useState, useEffect } from 'react'
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'

export default function Search() {
    const [input, setInput] = useState('')


    const [dataTasks, setDataTasks] = useState([])
    const [dataNotes, setDataNotes] = useState([])

    const [previewTask, setPreviewTask] = useState([])

    //supabase
    const supabase = useSupabaseClient()
    const session = useSession()
    const user = useUser()


    async function preview1(eventId) {
        const { data, error } = await supabase
            //from bothe todos table and notesv2 table
            .from('todos')
            .select('title')
            .eq('linkedEventId', eventId)

        setPreviewTask(data)

    }

    async function search() {
        const { data: tasksData, error: tasksError } = await supabase
            .from('todos')
            .select('title , nameTable')

        if (tasksError) console.log('error', tasksError)
        if (tasksData) {
            setDataTasks(tasksData)
        }

        const { data: notesData, error: notesError } = await supabase
            .from('notesv2')
            .select('title , nameTable')
            .eq('user_id', user?.id)



        if (notesError) console.log('error', notesError)
        if (notesData) {
            setDataNotes(notesData)
        }
    }

    const data = [...dataTasks, ...dataNotes]

    console.log(data)

    useEffect(() => {
        search()
        preview1(20)
    }, [])

    // useEffect(() => {
    //     //search only afther the user is done with typing
    //     //wait 500ms after the user stops typing to search for the input value in the database 
    //     const timer = setTimeout(() => {
    //         search()
    //     }, 5000);

    //     return () => clearTimeout(timer); //clear the timer if the user is still typing 

    // }, [input])

    return (
        <div>
            <h1>Search</h1>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} />

            {data.map((item, index) => (
                <div key={index}>{item.title}  {item.nameTable}</div>
            ))}


        </div>
    )
}
