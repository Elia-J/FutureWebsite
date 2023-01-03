import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from "next/navigation";
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import styles from '../styles/listOfNotes.module.scss';
import Image from 'next/image'

export default function ListOfNotes({ collapsed }) {

    //supabase
    const supabase = useSupabaseClient()
    const user = useUser()
    const router = useRouter()

    //data
    const [data, setData] = useState([])
    const [noteTitle, setNoteTitle] = useState("")
    // Aa for alphabetical ascending
    // Ad for alphabetical descending
    const [wayOfSorting, setWayOfSorting] = useState("Aa")

    // Gets all the notes where the userid=the session userid and puts that in the data variable
    async function getNotes() {
        const { data, error } = await supabase
            .from('notesv2')
            .select('*')
            .eq('user_id', user?.id)

        if (data) {
            //array of todos
            setData(data)
            checkSorting(data)
        }

        if (error) {
            console.log('error', error)
            return
        }
    }

    // Create new notes
    async function createNote() {
        // Makes sure it does not reload the page
        event.preventDefault()
        // Inserts the data into the database
        const { data, error } = await supabase
            .from('notesv2')
            .insert([
                { title: noteTitle, description: [{ "type": "paragraph", "children": [{ "text": "..." }] }], user_id: user?.id },
            ])

        // Resets the note title
        setNoteTitle("")

        if (data) {
            //array of todos
            setData(data)
        } if (error) {
            console.log('error', error)
            return
        }
    }

    // If the element is collapsed, change the classlist that gets picked up by the css
    let collapsElementButton = React.createRef();
    let collapsElementInput = React.createRef();

    let dropdownSorting = React.createRef();

    function setDropdownSorting() {
        dropdownSorting.current.classList.toggle(`${styles.show}`)
    }

    function changCollapsed() {
        if (collapsed) {
            collapsElementButton.current.classList.add(`${styles.isCollapsed}`)
            collapsElementInput.current.classList.add(`${styles.isCollapsed}`)
        } else {
            collapsElementButton.current.classList.remove(`${styles.isCollapsed}`)
            collapsElementInput.current.classList.remove(`${styles.isCollapsed}`)
        }
    }

    // Remove notes with id
    async function removeNote(id) {
        const { data, error } = await supabase
            .from('notesv2')
            .delete()
            .eq('id', id)
        if (data) {
            //array of todos
            setData(data)
        } if (error) {
            console.log('error', error)
            return
        }
    }

    // A function that sets the data variable to the data which will be sorted
    function sortNotesAlphAsc(d) {
        // Makes a copy so that the originial data is not lost
        var sortedData = [...d]

        sortedData.sort(function(a, b) {
            // Compares the title of all the elements
            if (a.title < b.title) {
                return -1;
            }
            if (b.title < a.title) {
                return 1;
            }
            return 0;
        })
        setData(sortedData)
    }

    function sortNotesAlphDesc(d) {
        // Makes a copy so that the originial data is not lost
        var sortedData = [...d]

        sortedData.sort(function(a, b) {
            // Compares the title of all the elements
            if (a.title > b.title) {
                return -1;
            }
            if (b.title > a.title) {
                return 1;
            }
            return 0;
        })
        setData(sortedData)
    }

    function sortNotesDateAsc(d) {
        // Makes a copy so that the originial data is not lost
        var sortedData = [...d]

        sortedData.sort(function(a, b) {
            // Compares the title of all the elements
            if (a.created_at > b.created_at) {
                return -1;
            }
            if (b.created_at > a.created_at) {
                return 1;
            }
            return 0;
        })
        setData(sortedData)
    }
    
    function sortNotesDateDesc(d) {
        // Makes a copy so that the originial data is not lost
        var sortedData = [...d]

        sortedData.sort(function(a, b) {
            // Compares the title of all the elements
            if (a.created_at < b.created_at) {
                return -1;
            }
            if (b.created_at < a.created_at) {
                return 1;
            }
            return 0;
        })
        setData(sortedData)
    }

    function checkSorting(d) {
        if (wayOfSorting == 'Aa') {
            sortNotesAlphAsc(d)
        } else if (wayOfSorting == 'Ad') {
            sortNotesAlphDesc(d)
        } else if (wayOfSorting == 'Da') {
            sortNotesDateAsc(d)
        } else {
            sortNotesDateDesc(d)
        }
    }
    
    // Loop to check if you clicked the red X that collapses the sections
    useEffect(() => {
        changCollapsed();
    })
    
    // Everytime the user creates a new note, the list of notes will update
    useEffect(() => {
        // checkSorting();
        getNotes()
    }, [createNote, removeNote])

    return (
        <div>
            <form onSubmit={createNote} className={styles.form}>
                <input ref={collapsElementInput} type="text" placeholder="Title: " onChange={(e) => setNoteTitle(e.target.value)} className={styles.input} required />
                <button ref={collapsElementButton} className={styles.mainButton} type="submit" >Create note</button>
            </form>
            <button className={styles.dropdownSort} onClick={setDropdownSorting}>
                <Image alt="sort" src="/sort.svg" width={25} height={25} />
            </button>
            <div ref={dropdownSorting} className={styles.dropdownContent}>
                <button onClick={() => {setWayOfSorting('Aa'); setDropdownSorting()}} className={styles.dropdownstylebutton}>Alphabetical (a-z)</button>
                <button onClick={() => {setWayOfSorting('Ad'); setDropdownSorting()}}className={styles.dropdownstylebutton}>Alphabetical (z-a)</button>
                <button onClick={() => {setWayOfSorting('Da'); setDropdownSorting()}}className={styles.dropdownstylebutton}>Created at (ascending)</button>
                <button onClick={() => {setWayOfSorting('Dd'); setDropdownSorting()}}className={styles.dropdownstylebutton}>Created at (descending)</button>
            </div>
            <hr />

            {/* Loops through the data */}
            {/* Sort of like foreach (element in List), but it has an index too */}
            {data.map((note, i) => {
                var title = note.title
                return (
                    <div key={i} className={styles.note}>
                        {/* The use of dynamic paging makes sure if you click on the title it will go to the appropriate link */}
                        <Link className={styles.link} href={`/app/note/${note.id}`}>
                            {title}
                        </Link>
                        <button className={styles.icon} onClick={() => removeNote(note.id)}>
                            <Image alt="Bold" src="/rich-text-icons/trash.svg" width={25} height={25} />
                        </button>

                    </div>
                )
                
            })}

        </div>
    )
}
