import styles from "/styles/search.module.scss";
import React, { useState, useEffect } from "react";
import LoadingLine from '/components/loadingLine'

import AppLayout from "/layouts/appLayout"
import { useSession, useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import Image from 'next/image'
import { useRouter } from 'next/router'
import Fuse from 'fuse.js'

export default function Search() {
    const session = useSession()
    const supabase = useSupabaseClient()
    const user = useUser()
    const router = useRouter()

    const [input, setInput] = useState('')
    const [dataEvents, setDataEvents] = useState([])
    const [dataNotes, setDataNotes] = useState([])
    const [dataTodos, setDataTodos] = useState([])
    const [dataFolders, setDataFolders] = useState([])
    const [dataTodoFolders, setDataTodoFolders] = useState([])
    const [match, setMatch] = useState([])
    const [wayOfSorting, setWayOfSorting] = useState('Aa')
    // Aa = alphabetical ascending
    // Ad = alphabetical descending
    // Da = date ascending
    // Dd = date descending

    let idMatches = []

    async function getNotes() {
        const { data, error } = await supabase
            .from('notesv2')
            .select('*')
            .eq('user_id', user?.id)
        if (data) {
            setDataNotes(data)
        }
        if (error) {
            console.log('error', error)
            return
        }
    }

    async function getFolders() {
        const { data, error } = await supabase
            .from('folders')
            .select('*')
            .eq('user_id', user?.id)
        if (data) {
            setDataFolders(data)
        }
        if (error) {
            console.log('error', error)
            return
        }
    }

    async function getTodos() {
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

    async function getEvents() {
        const { data, error } = await supabase
            .from('events')
            .select('*')
        if (data) {
            setDataEvents(data)
        }
        if (error) {
            console.log('error', error)
            return
        }
    }

    async function getTodoFolders() {
        const { data, error } = await supabase
            .from('todosFolders')
            .select('*')
        if (data) {
            setDataTodoFolders(data)
        }
        if (error) {
            console.log('error', error)
            return
        }
    }

    function getSearchElements() {
        event.preventDefault()
        let data = []
        setMatch([])
        idMatches = []

        let todos = [...dataTodos]
        for (let i = 0; i < todos.length; i++) {
            data.push(todos[i])
            // if (todos[i].title.toLowerCase().includes(input.toLowerCase())) {
            //     idMatches.indexOf(todos[i]) == -1 ? idMatches.push([todos[i], "todo"]) : console.log('')
            // }
            // else if (todos[i].description != undefined && todos[i].description.toLowerCase().includes(input.toLowerCase())) {
            //     idMatches.indexOf(todos[i]) == -1 ? idMatches.push([todos[i], "todo"]) : console.log('')
            // }
        }

        let notes = dataNotes.slice()
        for (let i = 0; i < notes.length; i++) {
            // loop through notes title
            data.push(notes[i])
            // if (notes[i].title.toLowerCase().includes(input.toLowerCase())) {
            //     idMatches.indexOf(notes[i]) == -1 ? idMatches.push([notes[i], "note"]) : console.log('')
            // }
            // else {
            //     // loop through notes description
            //     notes[i].description.forEach(partOfDescription => {
            //         // console.log(omschrijving.children)
            //         partOfDescription.children.forEach(child => {
            //             if (child.text.toLowerCase().includes(input.toLowerCase())) {
            //                 idMatches.indexOf(notes[i]) == -1 ? idMatches.push([notes[i], "note"]) : idMatches.push()
            //             }
            //         })
            //     })
            // }
        }

        let events = [...dataEvents]
        for (let i = 0; i < events.length; i++) {
            data.push(events[i])
            // if (events[i].title.toLowerCase().includes(input.toLowerCase())) {
            //     idMatches.indexOf(events[i]) == -1 ? idMatches.push([events[i], "event"]) : console.log('')
            // }
            // else if (events[i].description != null && events[i].description.toLowerCase().includes(input.toLowerCase())) {
            //     idMatches.indexOf(events[i]) == -1 ? idMatches.push([events[i], "event"]) : console.log('')
            // }
        }

        let folders = [...dataFolders]
        for (let i = 0; i < folders.length; i++) {
            data.push(folders[i])
            // if (folders[i].title.toLowerCase().includes(input.toLowerCase())) {
            //     idMatches.indexOf(folders[i]) == -1 ? idMatches.push([folders[i], "folder"]) : console.log('')
            // }
        }

        let todoFolders = [...dataTodoFolders]
        for (let i = 0; i < todoFolders.length; i++) {
            data.push(todoFolders[i])
            // if (todoFolders[i].title.toLowerCase().includes(input.toLowerCase())) {
            //     idMatches.indexOf(todoFolders[i]) == -1 ? idMatches.push([todoFolders[i], "todoFolder"]) : console.log('')
            // }
        }

        const options = {
            keys: ['title']
        }

        const fuse = new Fuse(data, options)
        // console.log(fuse)
        const result = fuse.search(input.toLowerCase())

        // console.log(data)
        console.log(result)
        // setMatch(result)
        // setMatch(checkSorting(idMatches))
    }

    function sortAlphAsc(match) {
        match = match.sort(function(a, b) {
            // Compares the title of all the elements
            return a[0].title.localeCompare(b[0].title, { ignorePuncuation: true })
        })
    }

    function sortAlphDesc(match) {
        match = match.sort(function(a, b) {
            // Compares the title of all the elements
            return b[0].title.localeCompare(a[0].title, { ignorePuncuation: true })
        })
    }

    function sortDateAsc(match) {
        match = match.sort(function(a, b) {
            // Compares the title of all the elements
            if (a[0].created_at == b[0].created_at) { return 0; }
            else if (a[0].created_at > b[0].created_at) { return 1; }
            else{ return -1; }
        })
    }

    function sortDateDesc(match) {
        match = match.sort(function(a, b) {
            // Compares the title of all the elements
            if (a[0].created_at == b[0].created_at) { return 0; }
            else if (a[0].created_at > b[0].created_at) { return -1; }
            else{ return 1; }
        })
    }

    function checkSorting(match, wayOfSorting) {
        if (wayOfSorting == 'Aa') {
            sortAlphAsc(match)
        } else if (wayOfSorting == 'Ad') {
            sortAlphDesc(match)
        } else if (wayOfSorting == 'Da') {
            sortDateAsc(match)
        } else if (wayOfSorting == 'Dd') {
            sortDateDesc(match)
        }
    }

    let dropdownSorting = React.createRef();

    function setDropdownSorting() {
        dropdownSorting.current.classList.toggle(`${styles.show}`)
    }

    useEffect(() => {
        getNotes()
        getFolders()
        getTodos()
        getEvents()
        getTodoFolders()
    }, [])

    function toEvent() {
        router.push("/app")
    }

    function toTodo() {
        router.push("/app/tasks")
    }

    function toNote(id) {
        router.push(`/app/note/${id}`)
    }

    function toFolder() {
        router.push("/app/note")
    }

    checkSorting(match, wayOfSorting)

    if (session) {
        return (
            <AppLayout>
                <div className={styles.container}>
                    <h1>Search</h1>
                    <form onSubmit={getSearchElements}>
                        <div className={styles.form}>
                            <input placeholder="Search:" className={styles.input} type="search" onChange={(e) => { setInput(e.target.value) }}></input>
                            <button className={styles.submitButton} type="submit">submit</button>
                        </div>
                    </form>
                    <div className={styles.items}>
                        <div style={{display: "flex", justifyContent: "flex-end"}}>
                            <div>
                                <button className={styles.dropdownSort} onClick={setDropdownSorting}>
                                    <Image alt="sort" src="/sort.svg" width={25} height={25} />
                                </button>
                                <div ref={dropdownSorting} className={styles.dropdownContent}>
                                    <button onClick={() => {setWayOfSorting('Aa')}} className={styles.dropdownstylebutton}>Alphabetical (a-z)</button>
                                    <button onClick={() => {setWayOfSorting('Ad')}} className={styles.dropdownstylebutton}>Alphabetical (z-a)</button>
                                    <button onClick={() => {setWayOfSorting('Da')}} className={styles.dropdownstylebutton}>Created at (ascending)</button>
                                    <button onClick={() => {setWayOfSorting('Dd')}} className={styles.dropdownstylebutton}>Created at (descending)</button>
                                </div>
                            </div>
                        </div>
                        <hr />
                        {match.map((item, i) => {
                            // make four cases, one for event, one for folders, one for todos and one for notes
                            // instead of just {item.title} it should link appropriatly
                            return (
                                <div key={i} className={styles.item}>
                                    <div className={styles.textAndIcon} onClick={() => {
                                        switch (item[1]) {
                                            case 'todo':
                                                toTodo()
                                                break;
                                            case 'event':
                                                toEvent()
                                                break;
                                            case 'folder':
                                                toFolder()
                                                break;
                                            case 'note':
                                                toNote(item[0].id)
                                                break;
                                            case 'todoFolder':
                                                toTodo()
                                                break;
                                        }
                                    }}>
                                        <Image alt="Bold" src={`/rich-text-icons-dark/${item[1]}.svg`} width={25} height={25} />
                                        {item[0].title}
                                    </div>
                                    <p className={styles.arrow}>&rarr;</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </AppLayout>
        )
    }
    else {
        return (
            <LoadingLine />
        )
    }
}