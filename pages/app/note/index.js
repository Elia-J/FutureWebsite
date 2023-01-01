import styles from "../../../styles/notes.module.scss";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import ListOfNotes from '../../../components/listOfNotes'
import LoadingLine from '/components/loadingLine'

import AppLayout from "/layouts/appLayout"
import { SettingsProvider } from "/layouts/stateStore"
import { useSession } from "@supabase/auth-helpers-react";


export default function Index() {

    const session = useSession()
    const router = useRouter();

    const [collapsed, setCollapsed] = useState(false)

    //get all notes where user_id = user.id

    let collapsableElementSavedNotes = React.createRef();
    let collapsableElementNotes = React.createRef();

    const [editor] = useState(() => withReact(createEditor()));
    const [editorTitle] = useState(() => withReact(createEditor()));

    function changeSavedNotesBar() {
        collapsableElementSavedNotes.current.classList.toggle(
            `${styles.collapsedSavedNote}`
        );
        collapsableElementNotes.current.classList.toggle(
            `${styles.extenedNote}`
        );
        if (collapsed) {
            setCollapsed(false)
        } else {
            setCollapsed(true)
        }
    }

    // useEffect(() => {
    //     if (!session) {
    //         router.push("/")
    //     }
    // })
    
    if (session) {
        return (
            <SettingsProvider>
                <AppLayout>

                <div className={styles.content}>
                    <div
                        ref={collapsableElementSavedNotes}
                        id="SavedNotes"
                        className={styles.SavedNotes}
                    >
                        <p style={{ display: "inline-block" }}>Saved Notes</p>
                        <p
                            className={styles.close}
                            style={{ display: "inline-block", float: "right" }}
                            onClick={changeSavedNotesBar}
                        >
                            &times;
                        </p>
                        <ListOfNotes collapsed={collapsed}/>
                    </div>
                    <div
                        ref={collapsableElementNotes}
                        id="TextEditor"
                        className={`${styles.TextEditor} ${styles.titleNoNotes}`}
                    >
                        <h1>Select one of your notes or create a note!</h1>
                    </div>
                </div>

                </AppLayout>
            </SettingsProvider >
        )
    }
    else {
        return (
            <LoadingLine />
        )
    }

}