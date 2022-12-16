import React, { useState, useEffect } from 'react'
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import Image from 'next/image'
import styles from "/styles/account.module.scss"
import SettingsLayout from '../../layouts/settingsLayout'
import ChangePictureIcon from "/public/changePictureIcon.svg"
import { TextOnly } from '/components/buttons';

export default function Account() {

    //supabase
    const supabase = useSupabaseClient()
    const session = useSession()
    const user = useUser()

    //data variables
    const [url, setUrl] = useState(process.env.NEXT_PUBLIC_IMAGE_URL)

    const [full_name, setFullName] = useState('')
    const [full_name_copy, setFullNameCopy] = useState('')

    const [username, setUsername] = useState('')
    const [username_copy, setUsernameCopy] = useState('')

    const [website, setWebsite] = useState('')
    const [website_copy, setWebsiteCopy] = useState('')

    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(true)
    const [showSaveButton, setShowSaveButton] = useState(false)


    //Get profile data from supabase
    async function getProfile() {

        try {
            //Request the profile data from the database
            let { data, error, status } = await supabase
                .from('profiles')
                .select(`username, full_name, website, avatar_url`)
                .eq('id', user.id)
                .single()

            //if there is an error and the status is not 406 (not found)
            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setUsername(data.username)
                setUsernameCopy(data.username)

                setWebsite(data.website)
                setWebsiteCopy(data.website)

                setFullName(data.full_name)
                setFullNameCopy(data.full_name)

                //only if there is a avatar_url
                if (data.avatar_url) {
                    downloadTheAvatar(data.avatar_url)
                }
            }

        } catch (error) {
            console.log(error)
        }
    }


    //#################################### Image Upload and Download ####################################
    //Handle avatar download
    async function downloadTheAvatar(avatarUrl) {

        try {
            const { data, error } = await supabase.storage
                .from('avatars')
                .download(avatarUrl)

            if (error) {
                throw error
            }

            // create a url for the file object to display in the browser
            const url2 = URL.createObjectURL(data)
            setUrl(url2)

        } catch (error) {
            // alert('Error downloading avatar')
            console.log(error)
        }
    }


    //handle delete old avatar or delete avatar 
    async function deleteOldImage() {

        //delete old image that begins with the user id
        const { error, data } = await supabase.storage
            .from('avatars')
            .remove([`${user.id}.jpg`, `${user.id}.png`, `${user.id}.jpeg`, `${user.id}.gif`, `${user.id}.webp`, `${user.id}.svg`, `${user.id}.jfif`, `${user.id}.bmp`, `${user.id}.tiff`, `${user.id}.ico`, `${user.id}.webp`])

        //update the user profile with null avatar_url
        const { error2, data2 } = await supabase
            .from('profiles')
            .update({ avatar_url: null })
            .eq('id', user.id)

        setUrl(process.env.NEXT_PUBLIC_IMAGE_URL)
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
            setUrl(url2)

            updateProfileTable(filePath)

        } catch (error) {
            console.log(error)
        }
    }


    //Handle profile avatar update
    async function updateProfileTable(urlPthe) {

        try {
            const { error, data } = await supabase
                .from('profiles')
                .update({ avatar_url: urlPthe })
                .eq('id', user.id)

            if (error) {
                throw error
            }

        } catch (error) {
            // alert('Error updating profile')
            console.log(error)
        }
    }

    const different = (a, b) => {
        if (a === b) {
            return false
        }
        return true
    }

    const changesDetected = () => {
        if (different(full_name_copy, full_name) === true || different(username_copy, username) === true || different(website_copy, website) === true) {

            setShowSaveButton(true)

        }
        else if (different(full_name_copy, full_name) === false && different(username_copy, username) === false && different(website_copy, website) === false) {

            setShowSaveButton(false)
        }
        else {
            setShowSaveButton(false)
        }
    }


    //reset old values function
    const resetOldValues = () => {
        setFullName(full_name_copy)
        setUsername(username_copy)
        setWebsite(website_copy)
    }


    //update profile function, not done yet
    async function updateProfile({ username, full_name, website }) {
        try {
            setLoading(true)
            const updates = {
                id: user.id,
                username,
                full_name,
                website,
                updated_at: new Date().toISOString(),
            }
            // //success
            // if (data.success) {
            //     setShowSaveButton(false)
            // }
            let { error } = await supabase.from('profiles').upsert(updates)
            if (error) {
                throw error
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


    //handle password check
    // const [checkPasswordText, setCheckPasswordText] = useState("")
    // //Check if the password is correct
    // async function checkPassword(password) {
    //     try {
    //         setLoading(true)
    //         let { data, error } = await supabase.auth.api.updateUser(user.id, { password })
    //         if (error) {
    //             throw error
    //         }
    //         if (data) {
    //             setCheckPasswordText("Password is correct")

    //         }
    //     } catch (error) {
    //         // alert('Error updating profile')
    //         setCheckPasswordText("Password is incorrect")
    //         console.log(error)
    //         return false
    //     } finally {
    //         setLoading(false)
    //     }
    // }


    //Handle delete account
    async function handleDeleteAccount() {
        try {
            setLoading(true)
            let { error } = await supabase.auth.admin
                .deleteUser(user.id)
            if (error) {
                throw error
            }
        } catch (error) {
            // alert('Error updating profile')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {

        changesDetected()

    }, [full_name, username, website])


    useEffect(() => {

        getProfile()

    }, [])


    return (
        <SettingsLayout
            title="Account"
            test={() => resetOldValues()}
            showSaveButton={showSaveButton}
            onSave={() => updateProfile({ username, full_name, website })}
        >

            <div className={styles.imageAndName}>

                <div className={styles.imagediv}>
                    <label htmlFor="upload" className={styles.uploadLabel} >
                        <ChangePictureIcon />
                    </label>
                    <input
                        id="upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => { fileUpload(e), changesDetected() }}
                        className={styles.uploadInput}
                    />
                    <Image
                        src={url}
                        alt="avatar"
                        fill
                        className={styles.avatar}
                    />
                </div>

                <div className={styles.data}>
                    <div className={styles.name}>{full_name}</div>
                    <div className={styles.username}>@{username} &#8226;{website}</div>
                </div>

            </div>

            <TextOnly text="Delete your profile picture" onClick={deleteOldImage} />

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
                        value={full_name}
                        onChange={(e) => { setFullName(e.target.value), changesDetected() }}
                        className={styles.input}
                        required
                        autoComplete="off"
                    />
                </div>


                <div className={styles.group}>
                    <label htmlFor="UserName" className={styles.label} >User Name</label>
                    <input
                        id="UserName"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={styles.input}
                        required
                        autoComplete="off"
                    />
                </div>

                <div className={styles.group}>
                    <label htmlFor="Website" className={styles.label} >Website</label>
                    <input
                        id="Website"
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className={styles.input}
                        required
                        autoComplete="off"
                    />
                </div>

            </div>

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

            </div>


        </SettingsLayout >
    )

}
