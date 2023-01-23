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
    const [score, setScore] = useState(0.5)
    // Aa = alphabetical ascending
    // Ad = alphabetical descending
    // Da = date ascending
    // Dd = date descending

    // gets the notes from the database
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

    // gets the folders from the database
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

    // gets the todos from the database
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

    // gets the events from the database
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

    // gets the todofolders from the database
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

    // sorts the data alphabetically ascending a-z
    function sortAlphAsc(data) {
        data = data.sort(function(a, b) {
            // Compares the title of all the elements
            return a.item.title.localeCompare(b.item.title, { ignorePuncuation: true })
        })
    }

    // sorts the data alphabetically descending z-a
    function sortAlphDesc(data) {
        data = data.sort(function(a, b) {
            // Compares the title of all the elements
            return b.item.title.localeCompare(a.item.title, { ignorePuncuation: true })
        })
    }

    // sorts the data by date ascending created first - created last
    function sortDateAsc(data) {
        data = data.sort(function(a, b) {
            // Compares the title of all the elements
            if (a.item.created_at == b.item.created_at) { return 0; }
            else if (a.item.created_at > b.item.created_at) { return 1; }
            else{ return -1; }
        })
    }

    // sorts the data by date descending created last - created first
    function sortDateDesc(data) {
        data = data.sort(function(a, b) {
            // Compares the title of all the elements
            if (a.item.created_at == b.item.created_at) { return 0; }
            else if (a.item.created_at > b.item.created_at) { return -1; }
            else{ return 1; }
        })
    }

    // checks which way of sorting is needed
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

    // so that the classname of the element can be changed
    let dropdownSorting = React.createRef();

    function setDropdownSorting() {
        dropdownSorting.current.classList.toggle(`${styles.show}`)
    }

    // gets the data at the beginning when the user opens the page
    useEffect(() => {
        getNotes()
        getFolders()
        getTodos()
        getEvents()
        getTodoFolders()
    }, [])

    // if event is clicked return to the calendar
    function toEvent() {
        router.push("/app")
    }

    // if the todo is clicked return to the todos
    // this function is used for todofolders too
    function toTodo() {
        router.push("/app/tasks")
    }

    // if the note is clicked return to the note with its id
    function toNote(id) {
        router.push(`/app/note/${id}`)
    }

    // if a folder is clicked return to the indexpage of notes
    function toFolder() {
        router.push("/app/note")
    }

    // keeps checking which way of sorting is needed
    checkSorting(match, wayOfSorting)

    function fuzzysearch(input) {
        // resets the matches
        setMatch([])
        let data = []

        // loads all the data into a local variable
        let todos = [...dataTodos]
        for (let i = 0; i < todos.length; i++) {
            data.push(todos[i])
        }

        let notes = dataNotes.slice()
        for (let i = 0; i < notes.length; i++) {
            data.push(notes[i])
        }

        let events = [...dataEvents]
        for (let i = 0; i < events.length; i++) {
            data.push(events[i])
        }

        let folders = [...dataFolders]
        for (let i = 0; i < folders.length; i++) {
            data.push(folders[i])
        }

        let todoFolders = [...dataTodoFolders]
        for (let i = 0; i < todoFolders.length; i++) {
            data.push(todoFolders[i])
        }

        // sets the options and on which fuse should search
        const options = {
            includeScore: true,
            keys: ['title', 'description', 'nameTable', ['description', 'children', 'text']]
        }

        // uses the library fuse.js to search through the whole data
        const fuse = new Fuse(data, options)
        const result = fuse.search(input)
        // if you want a strict search the score will be low and the other way around.
        // the score shows how confident fuse is on what you meant by what you typed
        // if the score you set is lower then the score fuse set it deletes that result
        for (let i=result.length-1; i>0; i--) {
            if (result[i].score > score) {
                result.splice(i, 1)
            }
        }

        // sets the matches to that result so that it automatically updates the list
        setMatch(result)
    }

    if (session) {
        return (
            <AppLayout>
                <div className={styles.container}>
                    <h1>Search</h1>
                    <div className={styles.form}>
                        <input placeholder="Search:" className={styles.input} type="search" onChange={(e) => { setInput(e.target.value); fuzzysearch(e.target.value)}}></input>
                    </div>
                    <div className={styles.items}>
                        <div style={{display: "flex", justifyContent: "flex-end"}}>
                            <div style={{width: "100%", display: "flex", justifyContent: "space-between"}}>
                                {/* sets score to see how strict you want to search */}
                                <div>
                                    <p>Score of search: </p>
                                    <input type="range" min="0.00001" max="2" step="0.0001" value={score} onChange={(e) => {setScore(e.target.value); fuzzysearch(input)}} className={styles.scoreInput}></input>
                                </div>
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
                        </div>
                        <hr />
                        {/* maps through the matches and returns the appropriate icon and name of the match */}
                        {match.map((match, i) => {
                            // make four cases, one for event, one for folders, one for todos and one for notes
                            // instead of just {item.item.title} it should link appropriatly
                            return (
                                <div key={i} className={styles.item}>
                                    <div className={styles.textAndIcon} onClick={() => {
                                        // for every click on the match if the match is for example a note it will go to the notes page
                                        switch (match.item.nameTable) {
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
                                                toNote(match.item.id)
                                                break;
                                            case 'todoFolder':
                                                toTodo()
                                                break;
                                        }
                                    }}>
                                        <Image alt="Bold" src={`/rich-text-icons-dark/${match.item.nameTable}.svg`} width={25} height={25} />
                                        {match.item.title}
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