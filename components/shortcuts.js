import React, { useRef, useEffect, useState } from 'react'
import styles from "/styles/shortcuts.module.scss"
import { useStateStoreContext } from "/layouts/stateStore"
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'

export default function Shortcuts() {
    const [showSettings, setShowSettings, shortcutsPanel, setShortcutsPanel] = useStateStoreContext()
    const [data, setData] = useState([])

    const shortcuts = useRef(null);

    //remove the hidden element with ref from the dom
    function removeElement() {
        // setTimeout(() => {
        shortcuts.current.remove();
        // }, 500);
    }

    //add the hidden element with ref to the dom inside the div with id="addEvent"
    function addElement() {
        // add the hidden element with ref to the dom inside the div with id="addEvent"
        document.getElementById("shortcutsHolder").appendChild(shortcuts.current);
    }


    //get shortcuts from supabase 
    const supabase = useSupabaseClient()
    const session = useSession()
    const user = useUser()

    async function getShortcuts() {
        const { data: shortcuts, error } = await supabase
            .from('shortcuts')
            .select('*')

        if (error) console.log('error', error.message)
        if (shortcuts) setData(shortcuts)

    }



    useEffect(() => {
        //if the state is true then add the element to the dom
        if (shortcutsPanel) {
            addElement()
        }
        //if the state is false then remove the element from the dom
        else {
            removeElement()
        }

        getShortcuts()
    }, [shortcutsPanel])



    return (
        <div id="shortcutsHolder">


            <div className={styles.shortcutsPanel} ref={shortcuts}>
                <div className={styles.panel}>
                    <div className={styles.shortcutsPanelHeader}>

                        <h3 className={styles.shortcutsPanelTitle}>Shortcuts</h3>
                        <button onClick={() => { setShortcutsPanel(!shortcutsPanel) }}>Close</button>

                    </div>
                    <div className={styles.shortcutsPanelBody}>

                        {data.map((shortcut) => {
                            return (
                                <div className={styles.nameAndShortcut} key={shortcut.id}>
                                    <h4>{shortcut.shortcut_name}</h4>
                                    <div className={styles.shortcut}>{shortcut.shortcut}</div>
                                </div>

                            )
                        })
                        }
                    </div>

                </div>
            </div>

        </div >
    )
}
