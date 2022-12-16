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
import Image from 'next/image'
import ListOfNotes from '../../../components/listOfNotes'

import AppLayout from "/layouts/appLayout"
import LoadingLine from '/components/loadingLine'
import { SettingsProvider } from "/layouts/stateStore"

import { useRouter } from "next/router";
import { useSession } from "@supabase/auth-helpers-react";

import { supabase } from "/lib/supasbaseClient"

// Function to toggle and select all the different styles for the editor
const CustomEditor = {
    isUnderlineMarkActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: (n) => n.underline === true,
            universal: true,
        });

        return !!match;
    },

    isBoldMarkActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: (n) => n.bold === true,
            universal: true,
        });

        return !!match;
    },

    isItalicMarkActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: (n) => n.italic === true,
            universal: true,
        })

        return !!match;
    },

    isCodeBlockActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: (n) => n.code === true,
            universal: true,
        });

        return !!match;
    },
    
    isH1BlockActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: (n) => n.type === "h1",
            universal: true,
        });

        return !!match;
    },
    
    isH2BlockActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: (n) => n.type === "h2",
        });

        return !!match;
    },
    
    isQuoteBlockActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: (n) => n.type === "quote",
        });

        return !!match;
    },
    
    isBulletListBlockActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: (n) => n.type === "bullet",
        });

        return !!match;
    },
    
    isRightAlignBlockActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: (n) => n.align === "right",
        });

        return !!match;
    },

    isLeftAlignBlockActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: (n) => n.align === "left",
        });

        return !!match;
    },
    
    isCenterAlignBlockActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: (n) => n.align === "center",
        });

        return !!match;
    },
    
    isJustifyAlignBlockActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: (n) => n.align === "justify",
        });

        return !!match;
    },

    toggleBoldMark(editor) {
        const isActive = CustomEditor.isBoldMarkActive(editor);
        Transforms.setNodes(
            editor,
            { bold: isActive ? null : true },
            { match: (n) => Text.isText(n), split: true }
        );
    },

    toggleItalicMark(editor) {
        const isActive = CustomEditor.isItalicMarkActive(editor);
        Transforms.setNodes(
            editor,
            { italic: isActive? null : true },
            { match: (n) => Text.isText(n), split: true }
        )
    },

    toggleUnderlineMark(editor) {
        const isActive = CustomEditor.isUnderlineMarkActive(editor);
        Transforms.setNodes(
            editor,
            { underline: isActive ? null : true },
            { match: (n) => Text.isText(n), split: true }
        );
    },

    toggleCodeBlock(editor) {
        const isActive = CustomEditor.isCodeBlockActive(editor);
        Transforms.setNodes(
            editor,
            { code: isActive ? null : true },
            { match: (n) => Text.isText(n), split: true }
        );
    },
    
    toggleH1Block(editor) {
        const isActive = CustomEditor.isH1BlockActive(editor);
        Transforms.setNodes(
            editor,
            { type: isActive ? null : "h1" },
            { match: (n) => Editor.isBlock(editor, n) }
        );
    },
        
    toggleH2Block(editor) {
        const isActive = CustomEditor.isH2BlockActive(editor);
        Transforms.setNodes(
            editor,
            { type: isActive ? null : "h2" },
            { match: (n) => Editor.isBlock(editor, n) }
        );    
    },
    
    toggleQuoteBlock(editor) {
        const isActive = CustomEditor.isQuoteBlockActive(editor);
        Transforms.setNodes(
            editor,
            { type: isActive ? null : "quote" },
            { match: (n) => Editor.isBlock(editor, n) }
        );    
    },
    
    toggleBulletListBlock(editor) {
        const isActive = CustomEditor.isBulletListBlockActive(editor);
        Transforms.setNodes(
            editor,
            { type: isActive ? null : "bullet" },
            { match: (n) => Editor.isBlock(editor, n) }
        );    
    },
    
    toggleRightAlignBlock(editor) {
        const isActive = CustomEditor.isRightAlignBlockActive(editor);
        Transforms.setNodes(
            editor,
            { align: isActive ? null : "right" },
            { match: (n) => Editor.isBlock(editor, n) }
        );    
    },
    toggleCenterAlignBlock(editor) {
        const isActive = CustomEditor.isCenterAlignBlockActive(editor);
        Transforms.setNodes(
            editor,
            { align: isActive ? null : "center" },
            { match: (n) => Editor.isBlock(editor, n) }
        );    
    },
    toggleLeftAlignBlock(editor) {
        const isActive = CustomEditor.isLeftAlignBlockActive(editor);
        Transforms.setNodes(
            editor,
            { align: isActive ? null : "left" },
            { match: (n) => Editor.isBlock(editor, n) }
        );    
    },
    toggleJustifyAlignBlock(editor) {
        const isActive = CustomEditor.isJustifyAlignBlockActive(editor);
        Transforms.setNodes(
            editor,
            { align: isActive ? null : "justify" },
            { match: (n) => Editor.isBlock(editor, n) }
        );    
    },
};

let globalAlign = "left";

export default function Notes({ notes }) {
    const session = useSession();
    const router = useRouter();

    const [initialValue, setInitialValue] = useState(notes.description)
    const [initialTitle, setInitialTitle] = useState(JSON.parse(notes.title))
    const [collapsed, setCollapsed] = useState(false)
    const [fontSize, setFontSize] = useState(8)

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
        const { data, error } = await supabase
            .from('notesv2')
            .update({ title: t, description: d })
            .eq('id', notes.id)
        alert('succes!')
    }

    let collapsableElementSavedNotes = React.createRef();
    let collapsableElementNotes = React.createRef();


    // Initializes the editors
    // We have two editors, one for the title and one for the description
    const [editor] = useState(() => withReact(createEditor()));
    const [editorTitle] = useState(() => withReact(createEditor()));

    // Function to make the saved notes bar smaller and bigger by adding a class to its classlist
    // This is picked up by the css and changes it's width
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
            case "bullet":
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

    // This function returns a Toolbar with buttons which add styling to the text
    const Toolbar = () => {
        return (
            <div className={styles.toolbar}>
                <button className={styles.buttonWithoutStyle}
                    // If you click on the button it will toggle the appropriate function to add the style
                    onMouseDown={() => {
                        CustomEditor.toggleBoldMark(editor);
                    }}
                >
                    <Image alt="Bold" className={styles.icon} src="/rich-text-icons/editor-bold.svg" width={25} height={25} />
                </button>
                <button className={styles.buttonWithoutStyle}
                    onMouseDown={() => {
                        CustomEditor.toggleItalicMark(editor);
                    }}
                >
                    <Image alt="Italic" className={styles.icon} src="/rich-text-icons/editor-italic.svg" width={25} height={25} />
                </button>
                <button className={styles.buttonWithoutStyle}
                    onMouseDown={() => {
                        CustomEditor.toggleUnderlineMark(editor);
                    }}
                >
                    <Image alt="Underline" className={styles.icon} src="/rich-text-icons/editor-underline.svg" width={25} height={25} />
                </button>
                <button className={styles.buttonWithoutStyle}
                    onMouseDown={() => {
                        CustomEditor.toggleCodeBlock(editor);
                    }}
                >
                    <Image alt="Code" className={styles.icon} src="/rich-text-icons/editor-code.svg" width={25} height={25} />
                </button>
                <button className={styles.buttonWithoutStyle}
                    onMouseDown={() => {
                        CustomEditor.toggleH1Block(editor);
                    }}
                >
                    <Image alt="H1" className={styles.icon} src="/rich-text-icons/editor-h1.svg" width={25} height={25} />
                </button>
                <button className={styles.buttonWithoutStyle}
                    onMouseDown={() => {
                        CustomEditor.toggleH2Block(editor);
                    }}
                >
                    <Image alt="H2" className={styles.icon} src="/rich-text-icons/editor-h2.svg" width={25} height={25} />
                </button>
                <button className={styles.buttonWithoutStyle}
                    onMouseDown={() => {
                        CustomEditor.toggleQuoteBlock(editor);
                    }}
                >
                    <Image alt="Quote" className={styles.icon} src="/rich-text-icons/editor-quote.svg" width={25} height={25} />
                </button>
                <button className={styles.buttonWithoutStyle}
                    onMouseDown={() => {
                        CustomEditor.toggleBulletListBlock(editor);
                    }}
                >
                    <Image alt="List Bullet" className={styles.icon} src="/rich-text-icons/editor-list-bulleted.svg" width={25} height={25} />
                </button>
                <button className={styles.buttonWithoutStyle}
                    onMouseDown={() => {
                        CustomEditor.toggleLeftAlignBlock(editor);
                    }}
                >
                    <Image alt="Left align" className={styles.icon} src="/rich-text-icons/editor-align-left.svg" width={25} height={25} />
                </button>
                <button className={styles.buttonWithoutStyle}
                    onMouseDown={() => {
                        CustomEditor.toggleCenterAlignBlock(editor);
                    }}
                >
                    <Image alt="Center align" className={styles.icon} src="/rich-text-icons/editor-align-center.svg" width={25} height={25} />
                </button>
                <button className={styles.buttonWithoutStyle}
                    onMouseDown={() => {
                        CustomEditor.toggleRightAlignBlock(editor);
                    }}
                >
                    <Image alt="Right Align" className={styles.icon} src="/rich-text-icons/editor-align-right.svg" width={25} height={25} />
                </button>
                <button className={styles.buttonWithoutStyle}
                    onMouseDown={() => {
                        CustomEditor.toggleJustifyAlignBlock(editor);
                    }}
                >
                    <Image alt="justivy Align" className={styles.icon} src="/rich-text-icons/editor-align-justify.svg" width={25} height={25} />
                </button>
                {/* event.preventdefault prevents the site from reloading when you submit the form */}
                {/* <form onSubmit={(event) => {event.preventDefault()}}>
                    <input type="number" min="8" max="28" value={fontSize} onChange={(e) => {setFontSize(e.target.value)}}></input>
                </form> */}
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
        return (
            <p style={{ textAlign: globalAlign }} {...props.attributes}>
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

    if (session) {
        // Returns the html is there is a session
        return (
            // The settingsProvider and AppLayout add the sidebar with settings functions
            <SettingsProvider>
                <AppLayout>
                    <div className={styles.content}>
                        <div
                            ref={collapsableElementSavedNotes}
                            id="SavedNotes"
                            className={styles.SavedNotes}
                        >
                            <p style={{ display: "inline-block" }}>Saved Notes</p>
                            {/* The X on the saved notes section */}
                            <p
                                className={styles.close}
                                style={{ display: "inline-block", float: "right" }}
                                onClick={changeSavedNotesBar}
                            >
                                &times;
                            </p>
                            {/* Returns the list of notes */}
                            <ListOfNotes collapsed={collapsed} />
                        </div>
                        <div
                            ref={collapsableElementNotes}
                            id="TextEditor"
                            className={styles.TextEditor}
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
                                {/* Returns the Toolbar with too breaks above and underneath it */}
                                {/* The Toolbar element is defined in this file */}
                                <hr />
                                <Toolbar />
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
                                                        CustomEditor.toggleCodeBlock(editor);
                                                        break;
                                                    }

                                                    case "b": {
                                                        event.preventDefault();
                                                        CustomEditor.toggleBoldMark(editor);
                                                        break;
                                                    }
                                                    case "i": {
                                                        event.preventDefault();
                                                        CustomEditor.toggleItalicMark(editor);
                                                        break;
                                                    }
                                                    case "u": {
                                                        event.preventDefault();
                                                        CustomEditor.toggleUnderlineMark(editor);
                                                        break;
                                                    }
                                                    case "1": {
                                                        event.preventDefault();
                                                        CustomEditor.toggleH1Block(editor);
                                                        break;
                                                    }
                                                    case "2": {
                                                        event.preventDefault();
                                                        CustomEditor.toggleH2Block(editor);
                                                        break;
                                                    }
                                                    case "q": {
                                                        event.preventDefault();
                                                        CustomEditor.toggleQuoteBlock(editor);
                                                        break;
                                                    }
                                                    case "b" && "l": {
                                                        event.preventDefault();
                                                        CustomEditor.toggleBulletListBlock(editor);
                                                        break;
                                                    }
                                                    case "Shift" && "R": {
                                                        event.preventDefault();
                                                        CustomEditor.toggleRightAlignBlock(editor);
                                                        break;
                                                    }
                                                    case "Shift" && "L": {
                                                        event.preventDefault();
                                                        CustomEditor.toggleLeftAlignBlock(editor);
                                                        break;
                                                    }
                                                    case "Shift" && "E": {
                                                        event.preventDefault();
                                                        CustomEditor.toggleCenterAlignBlock(editor);
                                                        break;
                                                    }
                                                    case "Shift" && "J": {
                                                        event.preventDefault();
                                                        CustomEditor.toggleJustifyAlignBlock(editor);
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
                                    updateData(JSON.stringify(valueTitle), valueDescription)
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </AppLayout>
            </SettingsProvider>
        );
    } else {
        // If there is not a session, return the loadingline
        return (
            <LoadingLine />
        )
    }
}

export async function getStaticPaths() {
    const { data, error } = await supabase
        .from('notesv2')
        .select('id')
    const paths = data.map((note) => ({
        params: { id: JSON.stringify(note.id) },
    }))
    return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
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