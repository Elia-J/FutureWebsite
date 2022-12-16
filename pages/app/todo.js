import React, { useState } from 'react'
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'

export default function Todo() {
    const session = useSession()
    const supabase = useSupabaseClient()
    const user = useUser()

    const [taskName, setTaskName] = useState("Test 1")
    const [data, setDate] = useState([])
    //create a new task with supabase
    const createTask = async () => {
        const { data, error } = await supabase
            .from('todos')
            .insert([
                { task: taskName, user_id: user.id },
            ])
        if (error) {
            console.log('error', error)
            return
        }
        console.log('data', data)
    }

    const getTodos = async () => {
        const { data, error } = await supabase
            .from('todos')
            .select('*')


        if (data) {
            //array of todos
            setDate(data)

        }
        if (error) {
            console.log('error', error)
            return
        }
        console.log('data', data)
    }

    return (
        <div>
            <button
                onClick={() => { createTask }}
            >
                Create Task
            </button>
            <button
                onClick={getTodos}>
                get todos
            </button>

            {/* map */}
            {data.map((todo, i) => {
                return (
                    <div key={i}>
                        {todo.task}
                        {todo.id}
                    </div>
                )
            })}

        </div >
    )
}
