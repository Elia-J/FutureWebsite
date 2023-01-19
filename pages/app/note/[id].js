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
import { StateProvider } from "/layouts/stateStore"

import { useRouter } from "next/router";
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'

import { supabase } from "/lib/supasbaseClient"
import { useTheme } from 'next-themes'

const CustomEditorV2 = {
    isActive(editor, prop, format) {
        switch(prop) {
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
                    // universal: true,
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
                    {   underline: isActive ? null : true,
                        fontSize: fontSize   
                    },
                    { match: (n) => Text.isText(n), split: true }
                );
                break;
            case "bold":
                Transforms.setNodes(
                    editor,
                    {   bold: isActive ? null : true,
                        fontSize: fontSize
                    },
                    { match: (n) => Text.isText(n), split: true }
                );
                break;
            case "italic":
                Transforms.setNodes(
                    editor,
                    {   italic: isActive ? null : true,
                        fontSize: fontSize 
                    },
                    { match: (n) => Text.isText(n), split: true }
                );
                break;
            case "code":
                Transforms.setNodes(
                    editor,
                    {   code: isActive ? null : true,
                        fontSize: fontSize 
                    },
                    { match: (n) => Text.isText(n), split: true }
                );
                break;
            case "type":
                Transforms.setNodes(
                    editor,
                    {   type: isActive ? null : format,
                        fontSize: fontSize 
                    },
                    { match: (n) => Editor.isBlock(editor, n) }
                );
                break;
            case "align":
                Transforms.setNodes(
                    editor,
                    {   align: isActive ? null : format,
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

    const [initialValue, setInitialValue] = useState(notes.description)
    const { theme, setTheme } = useTheme()

    const [THEME, setTHEME] = useState()

    const [initialTitle, setInitialTitle] = useState([{"type":"h1","children":[{"text":notes.title}]}])
    const [collapsed, setCollapsed] = useState(false)
    const [fontSize, setFontSize] = useState(16)
    // H1: 32
    // H2: 26
    // default: 16

    useEffect(() => {
        const html = document.querySelector('html')
        // console.log(html.getAttribute('data-theme'))
    }, [theme])

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
    // Variables to see if there have been changes.
    var valueDescription = initialValue;
    var valueTitle = initialTitle;

    // updateData gets a title and a description and updates them with the according note id
    async function updateData(t, d) {
        let now = new Date()
        let ISONow = now.toISOString()
        const { data, error } = await supabase
            .from('notesv2')
            .update({ title: t, description: d, created_at: ISONow })
            .eq('id', notes.id)
        alert('succes!')
        location.reload()
    }

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


    // Initializes the editors
    // We have two editors, one for the title and one for the description
    const [editor] = useState(() => withReact(createEditor()));
    const [editorTitle] = useState(() => withReact(createEditor()));

    // Function to make the saved notes bar smaller and bigger by adding a class to its classlist
    // This is picked up by the css and changes it's width

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
            default:
                return <DefaultElement {...props} />;
        }
    }, []);

    // This is a render leaf function for all the different styles. 
    // Controll click on "Leaf" and you can see which styles we can have
    const renderLeaf = useCallback((props) => {
        return <Leaf {...props} />;
    }, []);
    
    const Buttons = ["bold", "italic", "underline", "code", "h1", "h2", "quote", "list-bulleted", "align-left", "align-center", "align-right", "align-justify"]
    const ToolbarV2 = () => {
        return (
            <div className={styles.toolbar}>
                {
                    Buttons.map((button, i) => {
                        return (
                            <button key={i} className={styles.buttonWithoutStyle} onMouseDown={() => {
                                if (button.slice(0,5) == "align") {
                                    CustomEditorV2.toggle(editor, "align", button.split('-')[1], fontSize)
                                } else if (i<4) {
                                    CustomEditorV2.toggle(editor, button, true, fontSize)
                                } else {
                                    if (button=="h1") {
                                        CustomEditorV2.toggle(editor, "type", button, 32)
                                    } else if (button=="h2") {
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
                <div>
                    <button onClick={() => {setFontSize(fontSize + 1)}}>&#129093;</button>
                    <button onClick={() => {setFontSize(fontSize - 1)}}>&#129095;</button>
                </div>
            </div>
        )
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
        console.log(props.element.children[0].fontSize)
        return (
            <p style={{ textAlign: globalAlign, fontSize: props.element.children[0].fontSize}} {...props.attributes}>
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

    function parseISOString(s) {
        var b = s.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
      }

    if (session) {
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
                            <ListOfNotes />
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
                                            valueTitle = value;
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
                                <strong>{parseISOString(notes.created_at).toString().slice(0,24)}</strong>
                                {/* Returns the Toolbar with too breaks above and underneath it */}
                                {/* The Toolbar element is defined in this file */}
                                <hr />
                                {/* <Toolbar /> */}
                                <ToolbarV2 />
                                <hr />

                                 <div className={styles.description}>
                                     {/* Descriptor itself */}
                                     <Slate
                                        editor={editor}
                                        value={initialValue}
                                        /* saving the data */
                                        onChange={(value) => {
                                            valueDescription = value;
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
                            {/* Saves the data by using the updateData function */}
                            <button
                                className={styles.mainButton}
                                onClick={() => {
                                    updateData(valueTitle[0].children[0].text, valueDescription)
                                }}
                            >
                                Save
                            </button>
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
                            <strong>AI Assistance</strong>
                        </div>
                    </div>
                </AppLayout>
        );
    } else {
        // If there is not a session, return the loadingline
        return (
            <LoadingLine />
        )
    }
}

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