import React from 'react'
import styles from "/styles/dropdownApp.module.scss"
import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import ButtonWithIcon from './buttons'
import Image from 'next/image'
//icons
import Settings from "/public/Settings.svg"
import Logout from "/public/Logout.svg"

//theme
import { useTheme } from 'next-themes'


export default function DropdownApp({ settingsState }) {

    //supabase
    const supabase = useSupabaseClient()
    const session = useSession()
    const user = useUser()

    const router = useRouter()

    const [collapse, setCollapse] = useState(true);
    const dropdownIteam = collapse ? `${styles.dropdownListClose} ${styles.dropdownList}` : `${styles.dropdownListOpen} ${styles.dropdownList}`;

    //sign out function
    async function handleSignOut() {

        const { error } = await supabase.auth.signOut()

        if (error) alert(error.message)

        if (!error) {
            //redirect to home page using next router
            router.push("/")
        }
    }

    const [avatarUrl, setAvatarUrl] = useState(process.env.NEXT_PUBLIC_IMAGE_URL)

    //we will replace this with global variables
    // async function getProfileImage() {
    //     console.log("getProfileImage")
    //     try {
    //         let { data, error, } = await supabase
    //             .from('profiles')
    //             .select(`avatar_url`)

    //         if (data) {
    //             setUrl(data.avatar_url)
    //         }
    //         if (error) {
    //             console.log(error)
    //         }

    //         const { data2, error2 } = await supabase.storage
    //             .from('avatars')
    //             .download(
    //                 url2
    //             )
    //         if (data2) {
    //             setAvatarUrl(URL.createObjectURL(data2))
    //         }
    //         if (error2) {
    //             console.log(error)
    //         }

    //     }
    //     catch (error) {
    //         console.log("error: " + error)

    //     }
    // }


    //theme change, click counter until 3
    const { theme, setTheme } = useTheme()
    const [count, setcount] = useState(1)

    function counter() {

        if (count < 3) {
            setcount(count + 1)
            handleTheme()
        }
        else {
            setcount(1)
            handleTheme()
        }

    }

    //function handle theme
    function handleTheme() {

        switch (count) {
            case 1:
                setTheme('light')
                break;
            case 2:
                setTheme('dark')
                break;
            case 3:
                setTheme('system')
                break;
            default:
                setTheme('light')
                break;
        }

    }


    useEffect(() => {
        // getProfileImage()
    }, [])

    return (
        <div className={styles.dropdown}>

            <div className={styles.profileImage} onClick={() => setCollapse(!collapse)} >
                <Image
                    src={avatarUrl}
                    alt="Profile Image"
                    fill
                    className={styles.image}
                />
            </div>

            <div className={dropdownIteam}>
                <ButtonWithIcon icon={<Settings />} text="Settings" onClick={() => { settingsState(), setCollapse(!collapse) }} />
                <ButtonWithIcon icon={<Settings />} text={`${theme} Mode`} onClick={counter} />
                <ButtonWithIcon icon={<Logout />} text="Sign Out" onClick={() => { handleSignOut(), setCollapse(!collapse) }} />
                {/* version number */}
                <div className={styles.version}>v0.0.9</div>

            </div>

        </div>
    )
}

