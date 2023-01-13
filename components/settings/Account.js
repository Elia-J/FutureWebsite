import React, { useState, useEffect } from 'react'
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import Image from 'next/image'
import styles from "/styles/account.module.scss"
import SettingsLayout from '../../layouts/settingsLayout'
import ChangePictureIcon from "/public/changePictureIcon.svg"
import { TextOnly } from '/components/buttons';
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
//global variables
import { useStateStoreContext } from "/layouts/stateStore"


export default function Account() {

    //supabase
    const supabase = useSupabaseClient()
    const session = useSession()
    const user = useUser()

    const router = useRouter();
    //data variables
    // const [url, setUrl] = useState(process.env.NEXT_PUBLIC_IMAGE_URL)



    const [showSettings, setShowSettings, shortcutsPanel, setShortcutsPanel, settings, setSettings, saveButton, setSaveButton, settingsCopy, setSettingsCopy] = useStateStoreContext();



    //#################################### Image Upload and Download begin ####################################

    //handle delete old avatar or delete avatar 
    async function deleteOldImage() {

        //delete old image that begins with the user id
        const { error, data } = await supabase.storage
            .from('avatars')
            .remove([`${user.id}.jpg`, `${user.id}.png`, `${user.id}.jpeg`, `${user.id}.gif`, `${user.id}.webp`, `${user.id}.svg`, `${user.id}.jfif`, `${user.id}.bmp`, `${user.id}.tiff`, `${user.id}.ico`, `${user.id}.webp`])

        //update the user profile with null avatar_url
        // const { error2, data2 } = await supabase
        //     .from('profiles')
        //     .update(
        //         {
        //             avatar_url: null
        //         }
        //     )
        //     .eq('id', user.id)


        setSettings(
            {
                ...settings,
                avatar_url: "",
                profileImageUrl: "/pro.png"
            }
        )
        setSettingsCopy(
            {
                ...settingsCopy,
                avatar_url: "",
                profileImageUrl: "/pro.png"
            }
        )
    }

    //Handle file upload to supabase storage
    async function fileUpload(event) {

        try {
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0] // get the file from the input element 
            const fileExt = file.name.split('.').pop() // get the file extension
            const filePath = `${user.id}.${fileExt}` // create a unique file name based on the user id

            deleteOldImage()

            // upload the file to storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true })

            if (uploadError) {
                throw uploadError
            }

            const url2 = URL.createObjectURL(file)
            setSettings(
                {
                    ...settings,
                    profileImageUrl: url2,
                    filepath: filePath
                }
            )
            setSettingsCopy(
                {
                    ...settingsCopy,
                    avatar_url: "",
                    profileImageUrl: url2,
                }
            )



            // updateProfileTable(filePath)

        } catch (error) {
            console.log(error)
        }
    }

    // //Handle profile avatar update
    // async function updateProfileTable(urlPthe) {

    //     try {
    //         const { error, data } = await supabase
    //             .from('profiles')
    //             .update({ avatar_url: urlPthe })
    //             .eq('id', user.id)

    //         if (error) {
    //             throw error
    //         }

    //     } catch (error) {
    //         // alert('Error updating profile')
    //         console.log(error)
    //     }
    // }
    //#################################### Image Upload and Download end ####################################




    return (
        <SettingsLayout title="Account"  >

            <div className={styles.imageAndName}>

                <div className={styles.imagediv}>
                    <label htmlFor="upload" className={styles.uploadLabel} >
                        <ChangePictureIcon />
                    </label>
                    <input
                        id="upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => { fileUpload(e) }}
                        className={styles.uploadInput}
                    />
                    <Image
                        src={settings.avatar_url.includes("http") ? settings.avatar_url : settings.profileImageUrl}
                        alt="avatar"
                        fill
                        className={styles.avatar}
                    />
                </div>


                <div className={styles.data}>
                    <div className={styles.name}>{settings.FullName}</div>

                    {settings.UserName && settings.Website ? <div className={styles.username}>@{settings.UserName} &#8226;{settings.Website}</div> : null}

                </div>

            </div>

            <div className={styles.helppButtons}>
                <TextOnly text="Delete your profile picture" onClick={deleteOldImage} />
                <TextOnly text="Reset your password" onClick={
                    () => {
                        router.push("/forgot-password")
                        supabase.auth.signOut()
                    }
                } />
            </div>



            <div className={styles.inputHolder}>

                <div className={styles.group}>
                    <label htmlFor="email" className={styles.label} >Email</label>
                    <input
                        id="email"
                        type="email"
                        value={user?.email}
                        className={styles.input}
                        autoComplete="off"
                        disabled
                    />
                </div>

                <div className={styles.group}>
                    <label htmlFor="FullName" className={styles.label} >Full Name</label>
                    <input
                        id="FullName"
                        type="text"
                        value={settings.FullName}
                        onChange={(e) => {
                            setSettings({ ...settings, FullName: e.target.value })
                        }}
                        className={styles.input}
                        autoComplete="off"
                    />
                </div>



                <div className={styles.group}>
                    <label htmlFor="UserName" className={styles.label} >User Name</label>
                    <input
                        id="UserName"
                        type="text"
                        value={settings.UserName}
                        onChange={(e) => {
                            setSettings({ ...settings, UserName: e.target.value })
                        }}
                        className={styles.input}
                        autoComplete="off"
                    />
                </div>

                <div className={styles.group}>
                    <label htmlFor="Website" className={styles.label} >Website</label>
                    <input
                        id="Website"
                        type="text"
                        value={settings.Website}
                        onChange={(e) => {
                            setSettings({ ...settings, Website: e.target.value })
                        }}
                        className={styles.input}
                        autoComplete="off"
                    />
                </div>

            </div>
            {/* 
            <div className={styles.dnagerZoneArea}>

                <div className={styles.dnagerZone}>Danger Zone</div>

                <div className={styles.group}>
                    <label htmlFor="password" className={styles.label} >Your password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                        required
                        autoComplete="off"
                    />
                    <button className={styles.checkPasswordButton} onClick={handleDeleteAccount}>Check Password</button>
                </div>


                <div className={styles.group}>
                    <label htmlFor="text" className={styles.label} >Delete Account</label>
                    <button className={styles.deleteButton} onClick={handleDeleteAccount}>Delete Account</button>
                </div>

            </div> */}


        </SettingsLayout >
    )

}
