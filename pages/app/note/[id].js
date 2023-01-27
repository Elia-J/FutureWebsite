/*
First of all, we use dynamic routing
The title of this document is [id] and in the folder /app/note
so if you go to the link /app/note/{a number} 
it will look in the database for this number and set the title and description to those values
*/

import styles from "../../../styles/notes.module.scss";
import React, { useState, useCallback, useEffect } from "react";
import { createEditor, Editor, Text, Transforms } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import Image from 'next/image';
import ListOfNotes from '../../../components/listOfNotes'

import AppLayout from "/layouts/appLayout"
import LoadingLine from '/components/loadingLine'

import { useRouter } from "next/router";
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import Link from 'next/link'

import { supabase } from "/lib/supasbaseClient"
import Ai from "/components/ai"

const CustomEditorV2 = {
    isActive(editor, prop, format) {
        switch (prop) {
            case "underline":
                const [match1] = Editor.nodes(editor, {
                    match: (n) => n.underline === true,
                    universal: true,
                });
                return !!match1;
            case "bold":
                const [match2] = Editor.nodes(editor, {
                    match: (n) => n.bold === true,
                    universal: true,
                });
                return !!match2;
            case "italic":
                const [match3] = Editor.nodes(editor, {
                    match: (n) => n.italic === true,
                    universal: true,
                })
                return !!match3;
            case "code":
                const [match4] = Editor.nodes(editor, {
                    match: (n) => n.code === true,
                    universal: true,
                })
                return !!match4;
            case "type":
                const [match5] = Editor.nodes(editor, {
                    match: (n) => n.type === format,
                    universal: true,
                })
                return !!match5;
            case "align":
                const [match6] = Editor.nodes(editor, {
                    match: (n) => n.align === format,
                    universal: true,
                })
                return !!match6;
        }
    },

    toggle(editor, prop, format, fontSize) {
        const isActive = CustomEditorV2.isActive(editor, prop, format)
        switch (prop) {
            case "underline":
                Transforms.setNodes(
                    editor,
                    {
                        underline: isActive ? null : true,
                        fontSize: fontSize
                    },
                    { match: (n) => Text.isText(n), split: true }
                );
                break;
            case "bold":
                Transforms.setNodes(
                    editor,
                    {
                        bold: isActive ? null : true,
                        fontSize: fontSize
                    },
                    { match: (n) => Text.isText(n), split: true }
                );
                break;
            case "italic":
                Transforms.setNodes(
                    editor,
                    {
                        italic: isActive ? null : true,
                        fontSize: fontSize
                    },
                    { match: (n) => Text.isText(n), split: true }
                );
                break;
            case "code":
                Transforms.setNodes(
                    editor,
                    {
                        code: isActive ? null : true,
                        fontSize: fontSize
                    },
                    { match: (n) => Text.isText(n), split: true }
                );
                break;
            case "type":
                Transforms.setNodes(
                    editor,
                    {
                        type: isActive ? null : format,
                        fontSize: fontSize
                    },
                    { match: (n) => Editor.isBlock(editor, n) }
                );
                break;
            case "align":
                Transforms.setNodes(
                    editor,
                    {
                        align: isActive ? null : format,
                        fontSize: fontSize
                    },
                    { match: (n) => Editor.isBlock(editor, n) }
                );
        }
    }
}

let globalAlign = "left";

export default function Notes({ notes }) {
    const router = useRouter();
    //supabase
    const supabase = useSupabaseClient()
    const session = useSession()
    const user = useUser()
    const [dataTasks, setDataTasks] = useState([])
    const [taskID, setTaskID] = useState([])
    const [loadingTask, setLoadingTask] = useState(true)
    useEffect(() => {
        getTasks()
    }, [])

    function deleteDeletedTasks(data) {
        let test = [...data]
        // for (let j=0; j<test.length; j++) {
        //     if (test[j].type == "task") {
        //         if (taskID.indexOf(test[j].ID)  == -1) {
        //             test.splice(j, 1)
        //         }
        //     } else {
        //         console.log('nee')
        //     }
        // }
        return test
    }
    

    // sets the initial value used by the slate editor
    const [initialValue, setInitialValue] = useState(notes.description)
    const [initialTitle, setInitialTitle] = useState([{ "type": "h1", "children": [{ "text": notes.title }] }])

    // sets the initial value title used by the slate editor
    const [fontSize, setFontSize] = useState(16)
    // H1: 32
    // H2: 26
    // default: 16


    // Checks if there is a change in the url, if so, it reloads the page
    // This is to make sure that the correct initialValue and initialTitle is loaded into the editor
    // Else the server will load the value one time and won't change it
    useEffect(() => {
        const handleRouteChange = () => {
            location.reload()
        }

        router.events.on('routeChangeComplete', handleRouteChange)

        // If the component is unmounted, unsubscribe
        // from the event with the `off` method:
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [])

    // Variables to see if there have been changes made to the document.
    // var valueDescription = initialValue;
    const [valueDescription, setValueDescription] = useState(initialValue)
    // var valueTitle = initialTitle;
    const [valueTitle, setValueTitle] = useState(initialTitle)

    // updateData gets a title and a description and updates them with the according note id
    // it also updates the created_at to show when you last saved it.
    async function updateData(t, d, reload) {
        getTasks()
        let now = new Date()
        let ISONow = now.toISOString()
        const { data, error } = await supabase
            .from('notesv2')
            .update({ title: t, description: !loadingTask ? deleteDeletedTasks(d) : d, created_at: ISONow })
            .eq('id', notes.id)
        if (reload) {
            alert('succes!')
            location.reload()
        }
    }

    // Creates refs to make sure we can toggle different classNames.
    let collapsableElementSavedNotes = React.createRef();
    let collapsableElementNotes = React.createRef();
    let collapsableElementAI = React.createRef();
    let openElement = React.createRef();
    let closeElement = React.createRef();

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
            collapsableElementAI.current.classList.toggle(
                `${styles.showAIPanel}`
                )
            collapsableElementNotes.current.classList.toggle(
                `${styles.CollapsedTextEditor}`
            );
        }
    }


    // Initializes the editors
    // We have two editors, one for the title and one for the description
    const [editor] = useState(() => withReact(createEditor()));
    const [editorTitle] = useState(() => withReact(createEditor()));

    const renderElement = useCallback((props) => {
        // If the editor renders an eliment and there is an alignment prop then it sents the global align to its value
        // This is picked up by the other elements so that all different styles can have an alignment
        if (props.element.align) {
            switch (props.element.align) {
                case "left":
                    globalAlign = "left";
                    break;
                case "right":
                    globalAlign = "right";
                    break;
                case "center":
                    globalAlign = "center";
                    break;
                case "justify":
                    globalAlign = "justify";
            }
        }

        // To see which element it needs to render with the different types
        // It gives a copy of the props list so that if it changes in the element it doens't change globaly
        switch (props.element.type) {
            case "h1":
                return <H1Element {...props} />;
            case "h2":
                return <H2Element {...props} />;
            case "quote":
                return <QuoteElement {...props} />;
            case "list-bulleted":
                return <BulletElement {...props} />;
            case "task":
                return <TaskElement {...props} />;
            default:
                return <DefaultElement {...props} />;
        }
    }, []);

    async function getTasks() {
        setLoadingTask(true)
        const { data, error } = await supabase
            .from('todos')
            .select('*')
        if (data) {
            setDataTasks(data)
            let taskID = []
            for (let i=0; i<data.length; i++) {
                taskID.indexOf(data[i].id) == -1 ? taskID.push(data[i].id) : console.log('')
            }
            setTaskID(taskID)
            setLoadingTask(false)
        }
    }

    const tasksRef = React.createRef();

    // This is a render leaf function for all the different styles. 
    // Controll click on "Leaf" and you can see which styles we can have
    const renderLeaf = useCallback((props) => {
        return <Leaf {...props} />;
    }, []);

    // These are the buttons that toggle a style by the editor
    const Buttons = ["bold", "italic", "underline", "code", "h1", "h2", "quote", "list-bulleted", "align-left", "align-center", "align-right", "align-justify"]
    const ToolbarV2 = () => {
        return (
            <div className={styles.toolbar}>
                {/* it loops through that button each getting it's own icon and onMouseDown event */}
                {
                    Buttons.map((button, i) => {
                        return (
                            <button key={i} className={styles.buttonWithoutStyle} onMouseDown={() => {
                                // if the button starts with 'align' it should toggle the align function together with how it should align
                                if (button.slice(0, 5) == "align") {
                                    CustomEditorV2.toggle(editor, "align", button.split('-')[1], fontSize)
                                }
                                // if the first four buttons are clicked it only needs to set a propperty of the customeditor to true
                                else if (i < 4) {

                                    CustomEditorV2.toggle(editor, button, true, fontSize)
                                }
                                // for all other case (which are "h1", "h2", "quote" and "list-bulleted")
                                // it toggles the type propertie together with the button name
                                // for h1 and h2 it sets the fontsize to 32 or 26
                                else {
                                    if (button == "h1") {
                                        CustomEditorV2.toggle(editor, "type", button, 32)
                                    } else if (button == "h2") {
                                        CustomEditorV2.toggle(editor, "type", button, 26)
                                    } else {
                                        CustomEditorV2.toggle(editor, "type", button, fontSize)
                                    }
                                }

                            }}>
                                <Image alt={button} className={styles.icon} src={`/rich-text-icons-dark/editor-${button}.svg`} width={25} height={25} />
                            </button>
                        )
                    })
                }
                <div style={{display: "flex"}}>
                    <button className={styles.buttonWithoutStyle} onClick={() => showTasks()}>
                        <Image alt={'tasks'} className={styles.icon} src={`/Tasks.svg`} width={25} height={25} />
                    </button>
                    <div ref={tasksRef} className={styles.tasks}>
                        {dataTasks.map((task, i) => {
                            return (
                            <button 
                            key={i} 
                            className={`${styles.task} ${styles.buttonWithoutStyle}`}
                            onClick={() => {
                                Transforms.insertNodes(editor, {
                                    type: 'task',
                                    children: [{text: `${task.title}`}],
                                    fontSize: fontSize,
                                    ID: task.id
                                })
                                editor.insertBreak()
                                CustomEditorV2.toggle(editor, 'type', 'paragraph', fontSize)
                                Transforms.select(editor, Editor.end(editor, []))
                            }}
                            >
                                {task.title}
                            </button>
                            )
                        })}
                    </div> 
                </div>
                <div>
                    {/* The fontsize doens't toggle unless you call the CustomEditorV2 */}
                    {/* By calling a specific style twice, it does update the fontsize but it doesn't switch style */}
                    <button style={{ color: "#4c7987" }} onClick={() => { setFontSize(fontSize + 1); CustomEditorV2.toggle(editor, "bold", true, fontSize); CustomEditorV2.toggle(editor, "bold", true, fontSize) }}>&#129093;</button>
                    <button style={{ color: "#4c7987" }} onClick={() => { setFontSize(fontSize - 1); CustomEditorV2.toggle(editor, "bold", true, fontSize); CustomEditorV2.toggle(editor, "bold", true, fontSize) }}>&#129095;</button>
                </div>
            </div>
        )
    }

    function showTasks() {
        tasksRef.current.classList.toggle(`${styles.tasksShow}`)
    }

    // A function that returns all the different elements if called by the renderElement function
    const H1Element = (props) => {
        return (
            <h1 style={{ textAlign: globalAlign, margin: 5 }} {...props.attributes}>
                {props.children}
            </h1>
        );
    };

    const H2Element = (props) => {
        return (
            <h2 style={{ textAlign: globalAlign }} {...props.attributes}>
                {props.children}
            </h2>
        );
    };

    const BulletElement = (props) => {
        return (
            <div style={{ textAlign: globalAlign }}>
                <ul
                    style={{ display: "inline-block", textAlign: "left" }}
                    {...props.attributes}
                >
                    <li>{props.children}</li>
                </ul>
            </div>
        );
    };

    const TaskElement = (props) => {
        return (
            <div style={{display: "flex", gap: '5px'}}>
                <Image alt={'tasks'} className={styles.icon} src={`/Tasks.svg`} width={25} height={25} />
                <Link
                    {...props.attributes}
                    style={{textAlign: globalAlign}}
                    href={`/app/tasks/${props.element.ID}`}
                >
                    {props.children}
                </Link>
            </div>
        )
    }

    const QuoteElement = (props) => {
        return (
            <blockquote
                {...props.attributes}
                style={{ color: "gray", textAlign: globalAlign }}
            >
                {props.children}
            </blockquote>
        );
    };

    const DefaultElement = (props) => {
        return (
            <p style={{ textAlign: globalAlign, fontSize: props.element.children[0].fontSize }} {...props.attributes}>
                {props.children}
            </p>
        );
    };

    const Leaf = ({ attributes, children, leaf }) => {
        if (leaf.bold) {
            children = <strong>{children}</strong>;
        }
        if (leaf.italic) {
            children = <em>{children}</em>;
        }
        if (leaf.underline) {
            children = <u>{children}</u>;
        }
        if (leaf.code) {
            children = <code>{children}</code>;
        }

        return (
            <span
                {...attributes}
                style={{ backgroundColor: leaf.code ? "lightgray" : "transparent" }}
            >
                {children}
            </span>
        );
    };

    // parses the ISO string saved in the database to a date to show on the page
    function parseISOString(s) {
        var b = s.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    }

    useEffect(() => {
        //search only afther the user is done with typing
        //wait 500ms after the user stops typing to search for the input value in the database 
        const timer = setTimeout(() => {
            updateData(valueTitle[0].children[0].text, valueDescription, false)
        }, 1000);

        return () => clearTimeout(timer); //clear the timer if the user is still typing 

    }, [valueTitle, valueDescription])

    if (session && (user?.id == notes.user_id)) {
        // Returns the html is there is a session
        return (
            // The settingsProvider and AppLayout add the sidebar with settings functions
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
                        {/* Returns the list of notes */}
                        <ListOfNotes inApp={false} />
                    </div>
                    <div
                        ref={collapsableElementNotes}
                        id="TextEditor"
                        className={`${styles.TextEditor} ${styles.CollapsedTextEditor}`}
                    >
                        <div className={styles.editorDiv}>
                            {/* Title editor */}
                            <div className={styles.title}>
                                <h1>Title: </h1>
                                {/* The editor itself */}
                                <Slate
                                    editor={editorTitle}
                                    value={initialTitle}
                                    onChange={(value) => {
                                        // valueTitle = value;
                                        setValueTitle(value)
                                    }}
                                >
                                    <Editable
                                        className={styles.noteTitle}
                                        onKeyDown={(event) => {
                                            if (event.key == "Enter") event.preventDefault();
                                        }}
                                        renderElement={renderElement}
                                        renderLeaf={renderLeaf}
                                    />
                                </Slate>
                            </div>
                            {/* the date it was last edited */}
                            <strong>{parseISOString(notes.created_at).toString().slice(0, 24)}</strong>
                            {/* Returns the Toolbar with too breaks above and underneath it */}
                            {/* The Toolbar element is defined in this file */}
                            <hr />
                            {/* returns the toolbar */}
                            <ToolbarV2 />
                            <hr />

                            <div className={styles.description}>
                                {/* Descriptor itself */}
                                <Slate
                                    editor={editor}
                                    value={initialValue}
                                    /* saving the data */
                                    onChange={(value) => {
                                        setValueDescription(value)
                                    }}
                                >
                                    <Editable
                                        className={styles.noteDescription}
                                        renderElement={renderElement}
                                        renderLeaf={renderLeaf}
                                        onKeyDown={(event) => {
                                            // Checks for shortcut
                                            // Only if the ctrl key is pressed
                                            if (!event.ctrlKey) {
                                                return;
                                            }

                                            switch (event.key) {
                                                case ",": {
                                                    event.preventDefault();
                                                    CustomEditorV2.toggle(editor, "code", true, fontSize)
                                                    break;
                                                }

                                                case "b": {
                                                    event.preventDefault();
                                                    CustomEditorV2.toggle(editor, "bold", true, fontSize)
                                                    break;
                                                }
                                                case "i": {
                                                    event.preventDefault();
                                                    CustomEditorV2.toggle(editor, "italic", true, fontSize)
                                                    break;
                                                }
                                                case "u": {
                                                    event.preventDefault();
                                                    CustomEditorV2.toggle(editor, "underline", true, fontSize)
                                                    break;
                                                }
                                                case "1": {
                                                    event.preventDefault();
                                                    CustomEditorV2.toggle(editor, "type", "h1", fontSize)
                                                    break;
                                                }
                                                case "2": {
                                                    event.preventDefault();
                                                    CustomEditorV2.toggle(editor, "type", "h2", fontSize)
                                                    break;
                                                }
                                                case "q": {
                                                    event.preventDefault();
                                                    CustomEditorV2.toggle(editor, "type", "quote", fontSize)
                                                    break;
                                                }
                                                case "b" && "l": {
                                                    event.preventDefault();
                                                    CustomEditorV2.toggle(editor, "type", "list-bulleted", fontSize)
                                                    break;
                                                }
                                                case "Shift" && "R": {
                                                    event.preventDefault();
                                                    CustomEditorV2.toggle(editor, "align", "right", fontSize)
                                                    break;
                                                }
                                                case "Shift" && "L": {
                                                    event.preventDefault();
                                                    CustomEditorV2.toggle(editor, "align", "left", fontSize)
                                                    break;
                                                }
                                                case "Shift" && "E": {
                                                    event.preventDefault();
                                                    CustomEditorV2.toggle(editor, "align", "center", fontSize)
                                                    break;
                                                }
                                                case "Shift" && "J": {
                                                    event.preventDefault();
                                                    CustomEditorV2.toggle(editor, "align", "justify", fontSize)
                                                    break;
                                                }
                                            }
                                        }}
                                    />
                                </Slate>
                            </div>
                        </div>
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
                        <strong>AI Assistance</strong>
                    </div>
                </div>
            </AppLayout>
        );
    } else {
        // If there is not a session, return the loadingline
        return (
            <LoadingLine notYourNote={user?.id != notes.id ? true : false} />
        )
    }
}


// this gets the ID from the query and sets the notes propperty to the note corresponding with the id
export async function getServerSideProps({ params }) {
    const { id } = params

    const { data } = await supabase
        .from('notesv2')
        .select('*')
        .filter('id', 'eq', id)
        .single()
    return {
        props: {
            notes: data
        }
    }
}