import React, { useEffect } from 'react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import Layout from '/layouts/signInAndOutLayout.js'
import styles from "/styles/passwordReset.module.scss"
import { useRouter } from 'next/router'

export default function PasswordReset() {

    //authenticat the user by usign "SIGNED_IN" and "PASSWORD_RECOVERY" event
    const supabase = useSupabaseClient()
    const session = useSession()

    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");

    const router = useRouter()

    useEffect(() => {

        const { data: authListener } = supabase.auth.onAuthStateChange( //{data: authListener} is the event listener for the user authentication state

            async (event, session) => {

                if (event === "SIGNED_IN") {
                    console.log("signed in");
                    //   router.push("/dashboard");
                }

                else if (event === "PASSWORD_RECOVERY") {
                    console.log("password recovery");
                    //   router.push("/password-reset");
                }
            }
        )

        //redirect the user to the app if the user is already logged in
        // if (session) {
        //     router.push("/app");
        // }
        // else if (!session && !authListener) {
        //     router.push("/");
        // }
    }, [])

    //update the password using the supabase
    const handleSubmit = async (e) => {

        //prevent the page from reloading
        e.preventDefault();
        const notification = toast.loading("Changing Password");

        try {

            const { data, error } = await supabase.auth.updateUser(
                {
                    password: password1,
                }
            );

            if (error) {
                toast.error(error.message, {
                    id: notification,
                });
            }

            else if (data) {

                toast.success("Password Changed", {
                    id: notification,
                    iconTheme: {
                        primary: '#4C7987',
                        secondary: '#ffffff',
                    },
                });

                //Redirect the user to the App
                setTimeout(() => {
                    router.push("/app");
                }, 2000);
            }
        }

        catch (error) {
            toast.error("Sorry Error occured", {
                id: notification,
            });
        }
    };

    //Compare the password
    const comparePassword = (e) => {

        if (password1 === password2) {
            handleSubmit(e);
        }

        else {
            toast.error("Password does not match");
        }

    }

    return (
        <Layout title="Reset Your Password" image="/passwordReset-bg-image.jpeg">

            {/* password form */}
            <form onSubmit={comparePassword}>

                <div className={styles.group}>
                    <label className={styles.label} htmlFor="password">Password</label>
                    <input type="password" placeholder="password" className={styles.input} onChange={(e) => setPassword1(e.target.value)} />
                </div>

                {/* rewrite passw0rd */}
                <div className={styles.group}>
                    <label className={styles.label} htmlFor="password">Rewrite Password</label>
                    <input type="password" placeholder="rewrite password" className={styles.input} onChange={(e) => setPassword2(e.target.value)} />
                </div>

                <button type="submit" className={styles.mainButton}>Submit</button>
            </form>

            <Toaster position="bottom-right" reverseOrder={false} />
        </Layout>

    )
}
