import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from "next/navigation";
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import styles from '../styles/listOfNotes.module.scss';
import Image from 'next/image'

export default function ListOfNotes() {

    //supabase
    const supabase = useSupabaseClient()
    const user = useUser()
    const router = useRouter()

    //data
    const [data, setData] = useState([])
    const [folderData, setFolderData] = useState([])
    const [noteTitle, setNoteTitle] = useState("")
    const [folderTitle, setFolderTitle] = useState("")
    const [notesInFolder, setNotesInFolder] = useState([])
    // Aa for alphabetical ascending
    // Ad for alphabetical descending
    const [wayOfSorting, setWayOfSorting] = useState("Aa")

    var allIdsInFolder = []

    // Gets all the notes where the userid=the session userid and puts that in the data variable
    async function getNotes() {
        const { data, error } = await supabase
            .from('notesv2')
            .select('*')
            .eq('user_id', user?.id)
        if (data) {
            //array of todos
            setData(data)
            checkSorting(data, true)
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
            allIdsInFolder = []
            setFolderData(data)
            checkSorting(data, false)

            for (let i=0; i<data.length; i++) {
                for (let j=0; j<data[i].notesId.length; j++) {
                    // if (data[i].notesId[j] == undefined) {
                    //     return
                    // }
                    allIdsInFolder.push(data[i].notesId[j])
                }
            }

            setNotesInFolder(allIdsInFolder)
        } if (error) {
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

        getNotes()
    }

    async function createFolder() {
        event.preventDefault()
        
        const { data, error } = await supabase
        .from('folders')
        .insert([
            {title: folderTitle, user_id: user?.id}
        ])
        
        setFolderTitle("")
        
        if (data) {
            setFolderData(data)
        }
        if (error) {
            console.log('error', error)
        }

        getFolders()
    }

    // If the element is collapsed, change the classlist that gets picked up by the css

    let dropdownSorting = React.createRef();

    function setDropdownSorting() {
        dropdownSorting.current.classList.toggle(`${styles.show}`)
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

        getNotes()
        router.push('/app/note')
    }
    
    async function removeFolder(id) {
        const { data, error } = await supabase
            .from('folders')
            .delete()
            .eq('id', id)
        if (data) {
            //array of todos
            setFolderData(data)
        } if (error) {
            console.log('error', error)
            return
        }

        getFolders()
    }
    
    // zie regel 221 tasks.js omgedraaid

    async function prioritize(id, priority) {
        const {data, error} = await supabase
            .from('notesv2')
            .update({ isPriority: priority })
            .eq('id', id)

        if (error) {
            console.log('error', error)
            return
        }

        getNotes()
    }
    
    async function prioritizeFolder(id, priority) {
        const {data, error} = await supabase
            .from('folders')
            .update({ isPriority: priority })
            .eq('id', id)

        if (error) {
            console.log('error', error)
            return
        }

        getFolders()
    }

    function sortNotesPriority(d) {
        var sortedData = [...d]

        sortedData.sort(function(a, b) {
            if (a.isPriority == b.isPriority) { return 0 }
            else if (a.isPriority) { return -1 }
            else { return 1 }

        })

        return sortedData
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

        return sortNotesPriority(sortedData)
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
        return sortNotesPriority(sortedData)
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
        return sortNotesPriority(sortedData)
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
        return sortNotesPriority(sortedData)
    }

    function checkSorting(d, forNotes) {
        if (forNotes) {
            if (wayOfSorting == 'Aa') {
                setData(sortNotesAlphAsc(d))
            } else if (wayOfSorting == 'Ad') {
                setData(sortNotesAlphDesc(d))
            } else if (wayOfSorting == 'Da') {
                setData(sortNotesDateAsc(d))
            } else {
                setData(sortNotesDateDesc(d))
            }
        } else {
            if (wayOfSorting == 'Aa') {
                setFolderData(sortNotesAlphAsc(d))
            } else if (wayOfSorting == 'Ad') {
                setFolderData(sortNotesAlphDesc(d))
            } else if (wayOfSorting == 'Da') {
                setFolderData(sortNotesDateAsc(d))
            } else {
                setFolderData(sortNotesDateDesc(d))
            }
        }
    }

    const [selected, setSelected] = useState(null)
    function toggle(i) {
        if (selected == i) {
            return setSelected(null)
        }
        setSelected(i)
    }
    // useEffect(() => {
    //     // checkSorting(data);
    // }, [createNote, removeNote])
    
    // Loop to check if you clicked the red X that collapses the sections
    // useEffect(() => {
        // changCollapsed();
    // })
    
    // Everytime the user creates a new note, the list of notes will update
    
    useEffect(() => {
        getNotes()
        getFolders()
    }, [])

    return (
        <div>
            <form onSubmit={createNote} className={styles.form}>
                <input value={noteTitle} type="text" placeholder="Title: " onChange={(e) => setNoteTitle(e.target.value)} className={styles.input} required />
                <button className={styles.mainButton} type="submit" >Create note</button>
            </form>
            <form onSubmit={createFolder} className={styles.form}>
                <input value={folderTitle} type="text" placeholder="Title: " onChange={(e) => setFolderTitle(e.target.value)} className={styles.input} required />
                <button className={styles.mainButton} type="submit" >Create folder</button>
            </form>
            <div className={styles.addAndSortFolder}>
                <h3>Folders</h3>

                <div>   
                    {/* <button>
                        <div style={{display: 'flex', gap: '5px'}}>
                            <Image alt="folder" src="/rich-text-icons-dark/folder.svg" width={25} height={25} />
                            <p>New Folder</p>
                        </div>
                        
                    </button> */}
                    <button className={styles.dropdownSort} onClick={setDropdownSorting}>
                        <Image alt="sort" src="/sort.svg" width={25} height={25} />
                    </button>
                    <div ref={dropdownSorting} className={styles.dropdownContent}>
                        <button onClick={() => {setWayOfSorting('Aa'); setDropdownSorting()}} className={styles.dropdownstylebutton}>Alphabetical (a-z)</button>
                        <button onClick={() => {setWayOfSorting('Ad'); setDropdownSorting()}}className={styles.dropdownstylebutton}>Alphabetical (z-a)</button>
                        <button onClick={() => {setWayOfSorting('Da'); setDropdownSorting()}}className={styles.dropdownstylebutton}>Created at (ascending)</button>
                        <button onClick={() => {setWayOfSorting('Dd'); setDropdownSorting()}}className={styles.dropdownstylebutton}>Created at (descending)</button>
                    </div>
                </div>
            </div>

            <hr />

            {folderData.map((folder, i) => {
                return (
                    <div key={i}>
                        <div className={styles.folder}>
                            <div className={`${styles.link}`}>
                                <div className={`${styles.accordion} ${styles.folderText}`} onClick={() => toggle(i)}>
                                    <Image alt="Bold" src="/rich-text-icons-dark/folder.svg" width={25} height={25} />
                                    <p>{folder.title}</p>
                                </div>
                            </div>
                            
                            <button className={styles.icon} onClick={() => {prioritizeFolder(folder.id, !folder.isPriority)}}>
                                <Image alt="Bold" src={`/rich-text-icons-dark/exclamation-mark-${folder.isPriority}.svg`} width={25} height={25} />
                            </button>
                            <button className={styles.icon} onClick={() => removeFolder(folder.id)}>
                                <Image alt="Bold" src="/rich-text-icons-dark/trash.svg" width={25} height={25} />
                            </button>
                        </div>
                        <div className={selected == i ? `${styles.answerShow} ${styles.answer}` : styles.answer}>
                            {folder.notesTitle.map((note, i) => {
                                return (
                                    <div key={i} className={styles.accordionNotes}>
                                        <Image alt="Bold" src="/rich-text-icons-dark/note.svg" width={25} height={25} />
                                        <Link href={`/app/note/${folder.notesId[i]}`}>
                                            {note}
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}

            <h3>Notes</h3>
            <hr />

            {/* Loops through the data */}
            {/* Sort of like foreach (element in List), but it has an index too */}
            {data.map((note, index) => {
                var title = note.title
                for (let i=0; i<notesInFolder.length; i++) {
                    if (note.id == notesInFolder[i]) {
                        console.log(note.id)
                    }
                }
                return (
                    <div key={index} className={styles.note}>
                        {/* The use of dynamic paging makes sure if you click on the title it will go to the appropriate link */}
                        <Link className={styles.link} href={`/app/note/${note.id}`}>
                            <div className={styles.text}>
                                <Image alt="Bold" src="/rich-text-icons-dark/note.svg" width={25} height={25} />
                                <p>{title}</p>
                            </div>
                        </Link>
                        <button className={styles.icon} onClick={() => prioritize(note.id, !note.isPriority)}>
                            <Image alt="Bold" src={`/rich-text-icons-dark/exclamation-mark-${note.isPriority}.svg`} width={25} height={25} />
                        </button>
                        <button className={styles.icon} onClick={() => removeNote(note.id)}>
                            <Image alt="Bold" src="/rich-text-icons-dark/trash.svg" width={25} height={25} />
                        </button>

                    </div>
                )
                
            })}

        </div>
    )
}
