import styles from "../../../styles/notes.module.scss";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { createEditor } from "slate";
import { withReact } from "slate-react";
import ListOfNotes from '../../../components/listOfNotes'
import LoadingLine from '/components/loadingLine'
import Image from 'next/image'

import AppLayout from "/layouts/appLayout"
import { useSession } from "@supabase/auth-helpers-react";
import LoadingLine from '/components/loadingLine'


export default function Index() {

    const session = useSession()

    const [collapsed, setCollapsed] = useState(false)

    //get all notes where user_id = user.id

    let collapsableElementSavedNotes = React.createRef();
    let collapsableElementNotes = React.createRef();
    let collapsableElementAI = React.createRef();
    let openElement = React.createRef();
    let closeElement = React.createRef();

    function changeSavedNotesBar() {
        openElement.current.classList.toggle(`${styles.openHide}`)
        closeElement.current.classList.toggle(`${styles.closeShow}`)
        if (collapsableElementAI.current.classList[1] == styles.showAIPanel) {
            collapsableElementNotes.current.classList.toggle(
                `${styles.SuperCollapsedTextEditor}`
            );
            collapsableElementSavedNotes.current.classList.toggle(
                `${styles.hideNotesPanel}`
            )
        } else {
            collapsableElementNotes.current.classList.toggle(
                `${styles.CollapsedTextEditor}`
            );
            collapsableElementSavedNotes.current.classList.toggle(
                `${styles.hideNotesPanel}`
            )
        }
    }

    function changeAIPanel() {
        if (collapsableElementSavedNotes.current.classList[1] == undefined) {
            collapsableElementNotes.current.classList.toggle(
                `${styles.SuperCollapsedTextEditor}`
            );
            collapsableElementAI.current.classList.toggle(
                `${styles.showAIPanel}`
            )
        }
         else {
            collapsableElementNotes.current.classList.toggle(
                `${styles.CollapsedTextEditor}`
            );
            collapsableElementAI.current.classList.toggle(
                `${styles.showAIPanel}`
            )
        }
    }

    // useEffect(() => {
    //     if (!session) {
    //         router.push("/")
    //     }
    // })
    
    if (session) {
        return (
            <AppLayout>
                <div className={styles.content}>
                    <div ref={openElement} onClick={changeSavedNotesBar} className={`${styles.openStyle} ${styles.openHide}`}>
                        <strong>Open</strong>
                    </div>
                    <div ref={closeElement} onClick={changeSavedNotesBar} className={`${styles.closeStyle} ${styles.closeShow}`}>
                        <strong>Close</strong>
                    </div>
                    <div
                        ref={collapsableElementSavedNotes}
                        id="SavedNotes"
                        className={styles.SavedNotes}
                    >
                        <ListOfNotes />
                    </div>
                    <div
                        ref={collapsableElementNotes}
                        id="TextEditor"
                        className={`${styles.TextEditor} ${styles.CollapsedTextEditor} ${styles.titleNoNotes}`}
                    >   
                        <h1>Select one of your notes or create a note!</h1>
                    </div>
                    <div
                        ref={collapsableElementAI}
                        id="AI"
                        className={styles.AI}
                    >
                    </div>
                    <div
                        className={styles.AIAssisctance}
                        onClick={changeAIPanel}
                    >
                        AI Assistance
                    </div>
                </div>

            </AppLayout>
        )
    }
    else {
        return (
            <LoadingLine />
        )
    }

}