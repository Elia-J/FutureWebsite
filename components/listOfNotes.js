import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from "next/navigation";
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import styles from '../styles/listOfNotes.module.scss';
import Image from 'next/image'

export default function ListOfNotes({ inApp }) {

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
    // Da for date ascending
    // Dd for date descending

    const [wayOfSorting, setWayOfSorting] = useState("Aa")

    // Gets all the notes where the userid=the session userid and puts that in the data variable
    async function getNotes() {
        const { data, error } = await supabase
            .from('notesv2')
            .select('*')
            .eq('user_id', user?.id)
        if (data) {
            setData(data)
        }

        if (error) {
            console.log('error', error)
            return
        }
    }

    // Gets all the folders where userid=the session userid and puts that in the folderData variable
    async function getFolders() {
        const { data, error } = await supabase
            .from('folders')
            .select('*')
            .eq('user_id', user?.id)

        if (data) {
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
            // Resets the data to the latest version
            setData(data)
        } if (error) {
            console.log('error', error)
            return
        }

        getNotes()
    }

    // This function creates the folder the same way createNote() does
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

    // This is a ref that makes sure we can change the classList of the sorting button
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

        // Resets the data
        getNotes()
        if (!inApp) {
            // Only if you're not viewing the list of notes from the callendar
            // If you delete a note while youre editing it, you shouldn't be able to edit it still.
            router.push('/app/note')
        }
    }
    
    // Same function as removeNote() but without the router.push because you can't edit the folder.
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

    // Updates the wanted notes priority
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
    
    // same function as prioritize()
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

    // sorts the notes and folders by priority
    function sortPriority(data) {
        data = data.sort(function (noteX, noteY) {
            if(noteX.isPriority == noteY.isPriority) { return 0 }
            else if (noteX.isPriority) { return -1 }
            else { return 1 }
        })
    }

    // checks which sorter is used 
    function Sorter(data, wayOfSorting) {
        if (wayOfSorting == 'Aa') {
            AlphabeticalAscending(data)
        } else if (wayOfSorting == 'Ad') {
            AlphabeticalDescending(data)
        } else if (wayOfSorting == 'Da') {
            DateAscending(data)
        } else if (wayOfSorting == 'Dd') {
            DateDescending(data)
        }
        sortPriority(data)
    }

    // Sorts the data alphabetically ascending from a-z
    function AlphabeticalAscending(data) {
        data = data.sort(function (noteX, noteY) {
            return noteX.title.localeCompare(noteY.title, { ignorePuncuation: true })
        })
    }

    // Sorts the data alphabetically descending from z-a
    function AlphabeticalDescending(data) {
        data = data.sort(function (noteX, noteY) {
            return noteY.title.localeCompare(noteX.title, { ignorePuncuation: true })
        })
    }

    // Sorts the data by date from first created - last created
    function DateAscending(data) {
        data = data.sort(function (noteX, noteY) {
            if (noteX.created_at == noteY.created_at) { return 0 }
            else if (noteX.created_at > noteY.created_at) { return -1 }
            else { return 1 }
        })
    }

    // Sorts the data by date from last created - first created
    function DateDescending(data) {
        data = data.sort(function (noteX, noteY) {
            if (noteX.created_at == noteY.created_at) { return 0 }
            else if (noteX.created_at < noteY.created_at) { return -1 }
            else { return 1 }
        })
    }

    // Checks which addFolder button is sellected and sets the variable to the addFolder button which is currently selected.
    // This way if you click on the addFolder button it will show all the folders you made.
    const [selectedAddfolder, setSelectedAddFolder] = useState(null)
    function toggleAddFolder(i) {
        if (selectedAddfolder == i) {
            return setSelectedAddFolder(null)
        }
        setSelectedAddFolder(i)
    }

    // This checks if you clicked on a folder and shows the appropriate notes corresponding to that folder. 
    const [selected, setSelected] = useState(null)
    function toggle(i) {
        if (selected == i) {
            return setSelected(null)
        }
        setSelected(i)
    }
    
    // Removes the note from the folder
    async function removeFromFolder(folder, note) {
        for (let i=0; i<folder.notes.length; i++) {
            if (folder.notes[i] == note) {
                folder.notes.splice(i, 1)
                i--
            }
        }
        
        // updates the folder list of notes
        const { data, error } = await supabase
            .from('folders')
            .update({notes: folder.notes})
            .eq('id', folder.id)
        // updates if the note is in a folder
        const { dataNote, errorNote } = await supabase
            .from('notesv2')
            .update({inFolder: false})
            .eq('id', note.id)

        getNotes()
        getFolders()
    }


    // Adds the note to a folder
    async function addToFolder(folder, note) {
        // If it's not yet in the folder notes list it will push it.
        folder.notes.indexOf(note) === -1 ? folder.notes.push(note) : console.log('')
        // it first sets the inFolder variable to true on the database
        const { dataNote, errorNote } = await supabase
            .from('notesv2')
            .update({inFolder: true})
            .eq('id', note.id)

        // also does it locally so you don't need another api call to the database
        folder.notes[folder.notes.indexOf(note)].inFolder = true

        // then updates the folder notes list
        const { data, error } = await supabase
            .from('folders')
            .update({notes: folder.notes})
            .eq('id', folder.id)

        // resets the data
        getNotes()
        getFolders()
    }
    
    // Everytime the user opens the page, the list of notes and folders will update
    useEffect(() => {
        getNotes()
        getFolders()
    }, [])

    // keeps sorting the notes so it happens quick if you push the button
    Sorter(data, wayOfSorting)
    Sorter(folderData, wayOfSorting )
    return (
        <div>
            <h1>Saved Notes</h1>
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

            {/* Maps through the folders and for every folder inserts a div with a few buttons and icons */}
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
                        {/* if you selected one of your folders it will map through the notes corresponding with it */}
                        {/* it will show you the name of the note and it will give you the option to delete it from the folder */}
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
                // only shows the note if its not in a folder.
                // if it is in a folder it can be found in the corresponding folder.
                if (!note.inFolder) {
                    return (
                        <div key={index} className={styles.note}>
                            {/* it will show a link with an icon and the title */}
                            <Link className={styles.link} href={`/app/note/${note.id}`}>
                                <div className={styles.text}>
                                    <Image alt="Bold" src="/rich-text-icons-dark/note.svg" width={25} height={25} />
                                    <p>{note.title}</p>
                                </div>
                            </Link>
                            {/* a button to prioritize the note  */}
                            <button className={styles.icon} onClick={() => prioritize(note.id, !note.isPriority)}>
                                <Image alt="Bold" src={`/rich-text-icons-dark/exclamation-mark-${note.isPriority}.svg`} width={25} height={25} />
                            </button>
                            {/* a button to remove the note */}
                            <button className={styles.icon} onClick={() => removeNote(note.id)}>
                                <Image alt="Bold" src="/rich-text-icons-dark/trash.svg" width={25} height={25} />
                            </button>
                            {/* and a button to add it to a folder */}
                            <div>
                                <button className={styles.icon} onClick={() => toggleAddFolder(index)}>
                                    <Image alt="add folder" src={"/rich-text-icons-dark/add-folder.svg"} width={25} height={25}/>
                                </button>
                                {/* if it is selected it will show a list of all the usable folders */}
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
