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

    function sortNotesPriority(notes) {
        notes = notes.sort(function (noteX, noteY) {
            if(noteX.isPriority == noteY.isPriority) { return 0 }
            else if (noteX.isPriority) { return -1 }
            else { return 1 }
        })
    }

    function Sorter(notes, wayOfSorting) {
        if (wayOfSorting == 'Aa') {
            AlphabeticalAscending(notes)
        } else if (wayOfSorting == 'Ad') {
            AlphabeticalDescending(notes)
        } else if (wayOfSorting == 'Da') {
            DateAscending(notes)
        } else if (wayOfSorting == 'Dd') {
            DateDescending(notes)
        }
        sortNotesPriority(notes)
    }

    function AlphabeticalAscending(notes) {
        notes = notes.sort(function (noteX, noteY) {
            return noteX.title.localeCompare(noteY.title, { ignorePuncuation: true })
        })
    }

    function AlphabeticalDescending(notes) {
        notes = notes.sort(function (noteX, noteY) {
            return noteY.title.localeCompare(noteX.title, { ignorePuncuation: true })
        })
    }

    function DateAscending(notes) {
        notes = notes.sort(function (noteX, noteY) {
            if (noteX.created_at == noteY.created_at) { return 0 }
            else if (noteX.created_at > noteY.created_at) { return -1 }
            else { return 1 }
        })
    }

    function DateDescending(notes) {
        notes = notes.sort(function (noteX, noteY) {
            if (noteX.created_at == noteY.created_at) { return 0 }
            else if (noteX.created_at < noteY.created_at) { return -1 }
            else { return 1 }
        })
    }

    const [selectedAddfolder, setSelectedAddFolder] = useState(null)
    function toggleAddFolder(i) {
        if (selectedAddfolder == i) {
            return setSelectedAddFolder(null)
        }
        setSelectedAddFolder(i)
    }

    const [selected, setSelected] = useState(null)
    function toggle(i) {
        if (selected == i) {
            return setSelected(null)
        }
        setSelected(i)
    }
    
    async function removeFromFolder(folder, note) {
        for (let i=0; i<folder.notes.length; i++) {
            if (folder.notes[i] == note) {
                folder.notes.splice(i, 1)
                i--
            }
        }

        const { data, error } = await supabase
            .from('folders')
            .update({notes: folder.notes})
            .eq('id', folder.id)
        
        const { dataNote, errorNote } = await supabase
            .from('notesv2')
            .update({inFolder: false})
            .eq('id', note.id)

        getNotes()
        getFolders()
    }

    async function addToFolder(folder, note) {
        folder.notes.indexOf(note) === -1 ? folder.notes.push(note) : console.log('')
        const { dataNote, errorNote } = await supabase
            .from('notesv2')
            .update({inFolder: true})
            .eq('id', note.id)
        folder.notes[folder.notes.indexOf(note)].inFolder = true
        const { data, error } = await supabase
            .from('folders')
            .update({notes: folder.notes})
            .eq('id', folder.id)

        getNotes()
        getFolders()
    }
    
    // Everytime the user creates a new note, the list of notes will update
    
    useEffect(() => {
        getNotes()
        getFolders()
    }, [])

    Sorter(data, wayOfSorting)
    Sorter(folderData, wayOfSorting )
    return (
        <div>
            <form onSubmit={createNote} className={styles.form}>
                <input value={noteTitle} type="text" placeholder="Note:" onChange={(e) => setNoteTitle(e.target.value)} className={styles.input} required />
                <button className={styles.mainButton} type="submit" >Create note</button>
            </form>
            <form onSubmit={createFolder} className={styles.form}>
                <input value={folderTitle} type="text" placeholder="Folder:" onChange={(e) => setFolderTitle(e.target.value)} className={styles.input} required />
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
                        <button onClick={() => {setWayOfSorting('Da'); setDropdownSorting()}}className={styles.dropdownstylebutton}>Last change (ascending)</button>
                        <button onClick={() => {setWayOfSorting('Dd'); setDropdownSorting()}}className={styles.dropdownstylebutton}>Last change (descending)</button>
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
                            {folder.notes.map((note, i) => {
                                return (
                                    <div key={i} className={styles.accordionNotes}>
                                        <div style={{display: "flex"}}>
                                            <Image alt="Bold" src="/rich-text-icons-dark/note.svg" width={25} height={25} />
                                            <Link href={`/app/note/${note.id}`}>
                                                {note.title}
                                            </Link>
                                        </div>  
                                        <button className={styles.icon} onClick={() => {removeFromFolder(folder, note)}}>
                                            <Image alt="delete folder" src="/rich-text-icons-dark/delete-folder.svg" width={25} height={25}/>
                                        </button>
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
                if (!note.inFolder) {
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
                            <div>
                                <button className={styles.icon} onClick={() => toggleAddFolder(index)}>
                                    <Image alt="add folder" src={"/rich-text-icons-dark/add-folder.svg"} width={25} height={25}/>
                                </button>
                                <div className={selectedAddfolder == index ? `${styles.addFolderShow} ${styles.addFolder}` : styles.addFolder}>
                                    {folderData.map((folder, ind) => {
                                        return (
                                            <div key={ind}>
                                                <button className={styles.folderButton} onClick={() => {addToFolder(folder, note)}}>
                                                    {folder.title}
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
    
                        </div>
                    )
                }
                
            })}

        </div>
    )
}
