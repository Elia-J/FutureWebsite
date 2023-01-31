import styles from "../../../styles/notes.module.scss";
import React, { useState, useEffect } from "react";
import ListOfNotes from '../../../components/listOfNotes'
import Image from 'next/image'

import { useRouter } from "next/router";
import AppLayout from "/layouts/appLayout"
import { useSession } from "@supabase/auth-helpers-react";
import LoadingLine from '/components/loadingLine'

import Ai from "/components/ai"


export default function Index() {

    const session = useSession()
    const router = useRouter()

    // create refs for all element which needs its classname to be edited
    let collapsableElementSavedNotes = React.createRef();
    let collapsableElementNotes = React.createRef();
    let collapsableElementAI = React.createRef();
    let openElement = React.createRef();
    let closeElement = React.createRef();

    const [openAI, setOpenAI] = useState(false)

    // toggles the appropriate classNames for the saved notesbar
    function changeSavedNotesBar() {
        openElement.current.classList.toggle(`${styles.openHide}`)
        closeElement.current.classList.toggle(`${styles.closeShow}`)
        // if both the savednotes panel and ai panel are toggled it toggles the superCollapsed text editor
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

    // does the same as changeSavedNotesBar() but without the openelement and close element.
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

    if (session) {
        return (
            <AppLayout>
                <div className={styles.content}>
                    <div ref={openElement} onClick={changeSavedNotesBar} className={`${styles.button} ${styles.openStyle} ${styles.openHide}`}>
                        Open
                    </div>
                    <div ref={closeElement} onClick={changeSavedNotesBar} className={`${styles.button} ${styles.closeStyle} ${styles.closeShow}`}>
                        Close
                    </div>
                    <div
                        ref={collapsableElementSavedNotes}
                        id="SavedNotes"
                        className={styles.SavedNotes}
                    >
                        <ListOfNotes inApp={false} />
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
                        <Ai type="notes" />

                    </div>
                    <div
                        className={styles.AIAssisctance}
                        onClick={changeAIPanel}
                    >
                        <button className={styles.button} onClick={()=>{setOpenAI(!openAI)}}>

                        {openAI ? "close" : "AI Assistance"}
                        </button>
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