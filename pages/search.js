// import supabase from '/lib/supasbaseClient'
import React, { useState } from 'react'
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'

export default function Search() {

    const session = useSession()
    const supabase = useSupabaseClient()
    const user = useUser()

    const [search, setSearch] = useState('')
    const [notes, setNotes] = useState([])
    //search is the value of the input field
    async function searchNotes() {
        const { data, error } = await supabase
            .from('notesv2')
            .select('*')
            .like('title', search)
        console.log(data)
        setNotes(data)

    }



    return (
        <div>
            <h1>Search</h1>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
            <button onClick={searchNotes}>Search</button>

            {notes.map((note) => (
                <div key={note.id}>
                    <h1>{note.title}</h1>
                </div>
            )
            )}

        </div>
    )
}
