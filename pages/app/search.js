import styles from "/styles/search.module.scss";
import React, { useState, useEffect } from "react";
import Link from 'next/link'
import LoadingLine from '/components/loadingLine'

import AppLayout from "/layouts/appLayout"
import { SettingsProvider } from "/layouts/stateStore"
import { useSession, useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { preventDefault } from "fullcalendar";


export default function Index() {

    const session = useSession()
    const supabase = useSupabaseClient()
    const user = useUser()

    const [input, setInput] = useState('')
    const [dataEvents, setDataEvents] = useState()
    const [dataNotes, setDataNotes] = useState()
    const [dataTodos, setDataTodos] = useState()

    let idMatches = []

    async function getDataTodos() {
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            if (data) {
                setDataTodos(data)
            }
            if (error) {
                console.log('error', error)
                return
            }
    }
    async function getDataNotes() {
        const { data, error } = await supabase.from('notesv2').select('*').eq('user_id', user?.id)
        if (data) {
            setDataNotes(data)
        }
    }
    async function getDataEvents() {
        const { data, error } = await supabase.from('events').select('*')
        if (data) {
            setDataEvents(data)
        }
    }

    function getSearchElements() {
        event.preventDefault()
        let notes = [...dataNotes]
        for (let i=0; i<notes.length; i++) {
            // loop through notes title
            if (notes[i].title.toLowerCase().includes(input)) {
                idMatches.indexOf(notes[i]) == -1 ? idMatches.push(notes[i]) : console.log('')
            }

            // loop through notes description
            notes[i].description.forEach(partOfDescription => {
                // console.log(omschrijving.children)
                partOfDescription.children.forEach(child => {
                    if (child.text.toLowerCase().includes(input)) {
                        idMatches.indexOf(notes[i]) == -1 ? idMatches.push(notes[i]) : idMatches.push()
                    }
                })
            })
        }

        let todos = [...dataTodos]
        for (let i=0; i<todos.length; i++) {
            if (todos[i].title.toLowerCase().includes(input)) {
                idMatches.indexOf(todos[i]) == -1 ? idMatches.push(todos[i]) : console.log('')
            }
            if (todos[i].description.toLowerCase().includes(input)) {
                idMatches.indexOf(todos[i]) == -1 ? idMatches.push(todos[i]) : console.log('')
            }
        }

        let events = [...dataEvents]
        for (let i=0; i<events.length; i++) {
            if (events[i].title.toLowerCase().includes(input)) {
                idMatches.indexOf(events[i]) == -1 ? idMatches.push(events[i]) : console.log('')
            }
            if (events[i].description != null && events[i].description.toLowerCase().includes(input)) {
                idMatches.indexOf(events[i]) == -1 ? idMatches.push(events[i]) : console.log('')
            }
        }

        console.log(idMatches)
    }

    useEffect(() => {
        getDataTodos()
        getDataEvents()
        getDataNotes()
    }, [])

    if (session) {
        return (
            <SettingsProvider>
                <AppLayout>
                    <form onSubmit={getSearchElements}>
                        <input onChange={(e) => {setInput(e.target.value.toLowerCase()); getSearchElements()}} required></input>
                        <button type="submit">submit</button>
                    </form>
                    <div>
                        {idMatches.map((item, i) => {
                            return (
                                <div key={i}><Link href={`/app/note/${item.id}`}>{item.title}</Link></div>
                            )
                        })}
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