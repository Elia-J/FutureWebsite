import React, { useEffect, useState } from 'react'
import styles from "/styles/signInAndsignUp.module.scss"
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import toast, { Toaster } from 'react-hot-toast';

//Components and layouts
import Layout from '/layouts/signInAndOutLayout.js'
import SimpleLink from '/components/simpleLink'


//Icons
import GoogleIcon from "/public/google.svg"
import LinkIcon from "/public/link.svg"

export default function Signin() {
    const session = useSession()
    const supabase = useSupabaseClient()

    const notify = () => toast.success('Here is your toast.', {
        iconTheme: {
            primary: '#4C7987',
            secondary: '#ffffff',
        },
    });

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    //router is used to redirect the user, for example, after login to the App
    const router = useRouter()

    //Login 
    const handleLogin = async (e) => {

        //prevent the page from reloading
        e.preventDefault();

        // show loading toast
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        //if success, show message
        if (data) {
            console.log("success")
        }

        //if error, show message
        if (error) {
            toast.error(error.message)
        }
    }

    //Magic Link handler 
    const handleMagicLink = async (e) => {

        //prevent the page from reloading
        e.preventDefault();

        // show loading toast
        const { data, error } = await supabase.auth.signInWithOtp({
            email: email,
        }, {
            redirectTo: "https://future-website.vercel.app/app",
        })

        //if success, show message
        if (data) {
            console.log("success")
        }

        //if error, show message
        if (email == "") {
            toast.error("Please enter your email, to send you a magic link")
        }

        //if error, show message
        else if (error) {
            toast.error(error.message)
        }
    }

    //Google handler
    const handleGoogle = async (e) => {

        //prevent the page from reloading
        e.preventDefault();
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        })

        if (data) {
            //redirect to the app
            router.push("/app")
        }
    }


    //If all ready signed in, redirect to the app
    useEffect(() => {

        if (session) {
            toast.success('You are signed in', {
                iconTheme: {
                    primary: '#4C7987',
                    secondary: '#ffffff',
                }
            });
            setTimeout(() => {
                router.push('/app')
            }, 2000)
        }

    }, [session])


    return (
        <Layout title="Sign In" image="/sign-in-bg-image.jpeg" >

            <form onSubmit={handleLogin}>

                <div className={styles.group}>

                    <label htmlFor="email" className={styles.label} >Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                        required
                        autoComplete="off"
                    />

                </div>

                <div className={styles.group}>

                    <div className={styles.spaceBetween}>
                        <label htmlFor="password" className={styles.label} >Password</label>
                        <Link href="/forgot-password" className={styles.forgotPassword}>Forgot password?</Link>
                    </div>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                        required
                        autoComplete='off'
                    />

                </div>
                <button type="submit" className={styles.mainButton}>Sign In</button>
            </form>

            {/* links */}
            <div className={styles.links}>
                <SimpleLink text="Sign Up" LinkTo="/sign-up" />
                <SimpleLink text="About Us" LinkTo="/about" />
            </div>

            {/* --- or --- */}
            <div className={styles.orDiv}>

                <div className={styles.line}></div>
                <div className={styles.orText}>OR</div>

            </div>

            {/* Ways to sign in */}
            <div className={styles.socialSignIn}>

                <button className={styles.socialButton} onClick={handleMagicLink}>
                    <LinkIcon className={styles.iconColor} />
                    <span>Sign in with Magic Link</span>
                </button>

                <button className={styles.socialButton} onClick={handleGoogle}>
                    <GoogleIcon />
                    <span>Sign in with Google</span>
                </button>

            </div>

            <Toaster position="bottom-right" reverseOrder={false} />

        </Layout>
    )
}
