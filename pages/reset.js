import React, { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react'

function Reset() {

    const [email, setEmail] = useState("");
    const supabase = useSupabaseClient()
    const handleSubmit = async (e) => {

        e.preventDefault();
        const notification = toast.loading("Sending Email....");

        try {

            const { data, error } = await supabase.auth.resetPasswordForEmail(email,
                {
                    // redirect to the password reset page
                    redirectTo: "http://localhost:3000/password-reset",
                }
            );

            if (error) {
                toast.error(error.message, {
                    id: notification,
                });
            }

            else if (data) {
                console.log(data);
                toast.success("Sent", {
                    id: notification,
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
        <div>

            <form onSubmit={(e) => handleSubmit(e)}>

                <input type="email" placeholder="Please enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />

                <button type="submit">Submit</button>

                <Toaster position="bottom-right" reverseOrder={false} />
            </form>

        </div>
    );
}

export default Reset;