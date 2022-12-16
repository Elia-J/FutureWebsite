import React, { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Layout from '/layouts/signInAndOutLayout.js'
import styles from "/styles/forgot-password.module.scss"

function Reset() {

    const [email, setEmail] = useState("");
    const supabase = useSupabaseClient()

    const handleSubmit = async (e) => {

        //prevent the page from reloading
        e.preventDefault();
        const notification = toast.loading("Sending Email....");

        try {
            const { data, error } = await supabase.auth.resetPasswordForEmail(
                email,
                {
                    //This is the url that will be sent to the user's email to redirect them to the password reset page
                    redirectTo: "https://future-website.vercel.app/passwordReset",
                }
            );

            if (error) {
                toast.error(error.message, {
                    id: notification,
                });
            }

            else if (data) {
                toast.success("Email Sent Successfully!", {
                    id: notification,
                    iconTheme: {
                        primary: '#4C7987',
                        secondary: '#ffffff',
                    },
                });
            }
        }

        catch (error) {
            toast.error("Sorry Error occured", {
                id: notification,
            });
        }
    };

    return (
        <Layout title="Reset Your Password" image="/reset-bg-image.jpeg">

            <form onSubmit={(e) => handleSubmit(e)}>

                <div className={styles.group}>

                    <label htmlFor="email" className={styles.label} >Email</label>

                    <input
                        id="email"
                        type="email"
                        placeholder="Please enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                    />

                </div>

                < button type="submit" className={styles.mainButton} >Submit</ button>

            </form >

            {/* message */}
            <Toaster position="bottom-right" reverseOrder={false} />
        </Layout >
    );
}

export default Reset;