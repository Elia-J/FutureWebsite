import React, { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import toast, { Toaster } from 'react-hot-toast';

//styles, layout, components ...
import styles from "/styles/signInAndsignUp.module.scss"
import Layout from '/layouts/signInAndOutLayout.js'
import SimpleLink from '/components/simpleLink'

export default function Signup() {

    //supabase 
    const supabase = useSupabaseClient()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")

    const handleSignUp = async (e) => {

        // prevent refresh
        e.preventDefault()

        // show loading toast
        const notify = toast.loading("Loading...");

        // sign up
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: firstName + " " + lastName,
                }
            }
        })

        //If success, show message
        if (data) {

            toast.success('Success!',
                {
                    id: notify,
                    iconTheme: {
                        primary: '#4C7987',
                        secondary: '#ffffff',
                    }
                })

        }

        //If error, show message
        if (error) {
            toast.error(error.message,
                {
                    id: notify,
                })
        }
    }

    return (
        <Layout title="Sign Up" image="/sign-up-bg-image.jpeg" >

            <form onSubmit={handleSignUp}>
                <div className={styles.name}>

                    <div className={styles.group}>
                        <label htmlFor="firstName" className={styles.label} >First Name</label>
                        <input id="firstName" type="text" placeholder="first Name" onChange={(e) => setFirstName(e.target.value)} value={firstName} className={styles.input} required />
                    </div>

                    <div className={styles.group}>
                        <label htmlFor="lastName" className={styles.label} >Last Name</label>
                        <input id="lastName" type="text" placeholder="last Name" onChange={(e) => setLastName(e.target.value)} value={lastName} className={styles.input} required />
                    </div>

                </div>

                <div className={styles.group}>
                    <label htmlFor="email" className={styles.label} >Email</label>
                    <input id='email' type="email" placeholder="email" onChange={(e) => setEmail(e.target.value)} value={email} className={styles.input} required />
                </div>

                <div className={styles.group} >
                    <label htmlFor="password" className={styles.label} >Password</label>
                    <input id="password" type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} value={password} className={styles.input} required />
                </div>

                <button type="submit" className={styles.mainButton} >Sign Up</button>
            </form>

            <div className={styles.links}>
                <SimpleLink text="Sign In" LinkTo="/sign-in" />
                <SimpleLink text="Forgot your password?" LinkTo="/forgot-password" />
                <SimpleLink text="About Us" LinkTo="/about" />
            </div>

            <Toaster
                position="bottom-right"
                reverseOrder={false}
            />

        </Layout>
    )
}
