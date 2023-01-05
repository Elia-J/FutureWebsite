import styles from "/styles/search.module.scss";
import React, { useState, useEffect } from "react";
import Link from 'next/link'
import { useRouter } from 'next/router'
import LoadingLine from '/components/loadingLine'

import AppLayout from "/layouts/appLayout"
import { SettingsProvider } from "/layouts/stateStore"
import { useSession, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { preventDefault } from "fullcalendar";
import { supabase } from "/lib/supasbaseClient";


export default function Index() {

    const session = useSession()
    const user = useUser()

    const [input, setInput] = useState('')
    const [dataEvents, setDataEvents] = useState()
    const [dataNotes, setDataNotes] = useState()
    const [dataTodos, setDataTodos] = useState()

    let idMatches = [{
        "id": 2173,
        "created_at": "2023-01-05T18:08:50.373024+00:00",
        "title": "hoi",
        "description": [
            {
                "type": "paragraph",
                "children": [
                    {
                        "text": "HALLO"
                    }
                ]
            },
            {
                "type": "paragraph",
                "children": [
                    {
                        "text": "mooie text"
                    }
                ]
            },
            {
                "type": "paragraph",
                "children": [
                    {
                        "text": "ik hoop dat dit werkt",
                        "underline": true
                    }
                ]
            }
        ],
        "user_id": "c56771bd-eed0-48f3-b791-aa9e1aaf72ca",
        "descriptionText": null
    }]

    async function getDataNotes() {
        const { data, error } = await supabase.from('notesv2').select('*').eq('user_id', user?.id)
        if (data) {
            setDataNotes(data)
        }
    }
    async function getDataEvents(table) {
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

    useEffect(() => {
        getDataNotes()
        getDataEvents()
        getDataTodos()
    }, [])

    function getSearchElements() {
        event.preventDefault()
        let notes = [...dataNotes]
        for (let i=0; i<notes.length; i++) {
            // loop through notes title
            if (notes[i].title.toLowerCase().includes(input.toLowerCase())) {
                // idMatches.indexOf(notes[i].id) == -1 ? idMatches.push(notes[i].id) : console.log('')
            }

            // loop through notes description
            notes[i].description.forEach(partOfDescription => {
                // console.log(omschrijving.children)
                partOfDescription.children.forEach(child => {
                    if (child.text.toLowerCase().includes(input.toLowerCase())) {
                        idMatches.indexOf(notes[i]) == -1 ? idMatches.push(notes[i].id) : console.log('nee')
                    }
                })
            })
        }
    }

    if (session) {
        return (
            <SettingsProvider>
                <AppLayout>
                    <form onSubmit={getSearchElements}>
                        <input onChange={(e) => {setInput(e.target.value)}} required></input>
                        <button type="submit">submit</button>
                    </form>
                    {idMatches.map((item, i) => {
                        return (
                            <Link href={`/app/note/${item.id}`}>{item.title}</Link>
                        )
                    })}
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