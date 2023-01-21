import { createContext, useContext, useState } from "react";

const Context = createContext();


// settings show/hide
export function StateProvider({ children }) {

    const [shortcutsPanel, setShortcutsPanel] = useState(false);

    const [showSettings, setShowSettings] = useState(false);
    const [saveButton, setSaveButton] = useState(false);
    const [settingsCopy, setSettingsCopy] = useState();
    const [settings, setSettings] = useState({
        FullName: "",
        UserName: "",
        Website: "",
        Theme: "light",
        syncTheme: false,
        FirstDayOfTheWeek: "Monday",
        TimeZone: "Local",
        BeginTimeDay: "07:00:00",
        EndTimeDay: "22:00:00",
        ShowWeekends: true,
        avatar_url: "",
        profileImageUrl: "/pro.png",
        filepath: "",
    })

    return (
        <Context.Provider value={[
            showSettings, setShowSettings, shortcutsPanel, setShortcutsPanel, settings, setSettings, saveButton, setSaveButton, settingsCopy, setSettingsCopy
        ]}>
            {children}
        </Context.Provider>
    );
}

export function useStateStoreContext() {
    return useContext(Context);

}
