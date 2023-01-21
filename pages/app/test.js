import React, { useState, useEffect } from 'react'
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'

export default function Search() {
    const [input, setInput] = useState('')
    const [data, setData] = useState([])

    //supabase
    const supabase = useSupabaseClient()
    const session = useSession()
    const user = useUser()

    async function search() {
        const { data, error } = await supabase
            .from('todos')
            .select()
            .ilike('title', `%${input}%`)
        // .order('id', { ascending: false })
        // .limit(10)
        console.log(data)
        setData(data)

    }

    useEffect(() => {
        //search only afther the user is done with typing
        //wait 500ms after the user stops typing to search for the input value in the database 
        const timer = setTimeout(() => {
            search()
        }, 500);

        return () => clearTimeout(timer); //clear the timer if the user is still typing 

    }, [input])




    return (
        <div>
            <h1>Search</h1>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} />

            <ul>
                {data.map((item, index) => (
                    <li key={index}>{item.title}</li>
                ))}
            </ul>


        </div>
    )
}
