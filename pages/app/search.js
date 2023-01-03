import styles from "/styles/search.module.scss";
import React, { useState, useEffect } from "react";
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
    const [bigData, setBigData] = useState()

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
        // loop through notes title
        // loop through notes description
        let notes = [...dataNotes]
        for (let i=0; i<notes.length; i++) {
        }
        // loop through todos title
        // loop through todos description

        // loop through events title
        // loop through events description
    }

    if (session) {
        return (
            <SettingsProvider>
                <AppLayout>
                    <form onSubmit={getSearchElements}>
                        <input onChange={(e) => {setInput(e.target.value)}} required></input>
                        <button type="submit">submit</button>
                    </form>
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