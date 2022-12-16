import React, { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function PasswordReset() {
    const supabase = useSupabaseClient()

    const [password, setPassword] = useState("");
    const [hash, setHash] = useState(null);

    useEffect(() => {
        setHash(window.location.hash);
        console.log(setHash)
    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();
        const notification = toast.loading("Changing Password");

        try {
            // if the user doesn't have accesstoken
            if (!hash) {
                return toast.error("Sorry, Invalid token", {
                    id: notification,
                });
            }

            else if (hash) {
                const hashArr = hash.substring(1).split("&").map((param) => param.split("="));

                let type;
                let accessToken;

                for (const [key, value] of hashArr) {
                    if (key === "type") {
                        type = value;
                    } else if (key === "access_token") {
                        accessToken = value;
                    }
                }

                if (
                    // if the access token is an object then it's invalid
                    type !== "recovery" || !accessToken || typeof accessToken === "object"
                ) {
                    toast.error("Invalid access token or type", {
                        id: notification,
                    });
                    return;
                }

                //   now we will change the password
                const { data, error } = await supabase.auth.updateUser(
                    accessToken,
                    {
                        password: password,
                    }
                );

                if (error) {
                    toast.error(error.message, {
                        id: notification,
                    });
                }

                else if (!error) {
                    toast.success("Password Changed", {
                        id: notification,
                    });
                }
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

                <input
                    type="password"
                    required
                    value={password}
                    placeholder="Please enter your Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Submit</button>

                <Toaster position="bottom-right" reverseOrder={false} />
            </form>
        </div>
    );
}

