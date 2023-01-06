import styles from "/styles/search.module.scss";
import React, { useState, useEffect } from "react";
import Link from 'next/link'
import LoadingLine from '/components/loadingLine'

import AppLayout from "/layouts/appLayout"
import { SettingsProvider } from "/layouts/stateStore"
import { useSession, useUser } from "@supabase/auth-helpers-react";
import { preventDefault } from "fullcalendar";
import { supabase } from "/lib/supasbaseClient";


export default function Index() {

    const session = useSession()
    const user = useUser()

    const [input, setInput] = useState('')
    const [dataEvents, setDataEvents] = useState()
    const [dataNotes, setDataNotes] = useState()
    const [dataTodos, setDataTodos] = useState()

    let idMatches = []

    async function getDataNotes() {
        const { data, error } = await supabase.from('notesv2').select('*').eq('user_id', user?.id)
        if (data) {
            setDataNotes(data)
        }
    }
    async function getDataEvents() {
        const { data, error } = await supabase.from('events').select('*').eq('user_id', user?.id)
        if (data) {
            setDataEvents(data)
        }
    }
    async function getDataTodos() {
        const { data, error } = await supabase.from('todos').select('*').eq('user_id', user?.id)
        if (data) {
            setDataTodos(data)
        }
    }

    function getSearchElements() {
        event.preventDefault()
        let notes = [...dataNotes]
        for (let i=0; i<notes.length; i++) {
            // loop through notes title
            if (notes[i].title.toLowerCase().includes(input.toLowerCase())) {
                idMatches.indexOf(notes[i]) == -1 ? idMatches.push(notes[i]) : console.log('')
            }

            // loop through notes description
            notes[i].description.forEach(partOfDescription => {
                // console.log(omschrijving.children)
                partOfDescription.children.forEach(child => {
                    if (child.text.toLowerCase().includes(input.toLowerCase())) {
                        idMatches.indexOf(notes[i]) == -1 ? idMatches.push(notes[i]) : idMatches.push()
                    }
                })
            })
        }
    }

    useEffect(() => {
        getDataNotes()
        getDataEvents()
        getDataTodos()
    }, [])

    if (session) {
        return (
            <SettingsProvider>
                <AppLayout>
                    <form onSubmit={getSearchElements}>
                        <input onChange={(e) => {setInput(e.target.value); getSearchElements()}} required></input>
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