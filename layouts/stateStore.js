import { createContext, useContext, useState } from "react";

const Context = createContext();


// settings show/hide
export function StateProvider({ children }) {

    const [shortcutsPanel, setShortcutsPanel] = useState(false);

    const [showSettings, setShowSettings] = useState(false);
    const [saveButton, setSaveButton] = useState(false);
    const [warningPanel, setWarningPanel] = useState(
        {
            show: false,
            sentenceCheck: "",
        }
    );
    const [settingsCopy, setSettingsCopy] = useState();
    const [settings, setSettings] = useState({
        FullName: "",
        UserName: "",
        Website: "",
        Theme: "light",
        syncTheme: false,
        FirstDayOfTheWeek: "Monday",
        time_zone: "",
        BeginTimeDay: "07:00:00",
        EndTimeDay: "22:00:00",
        ShowWeekends: true,
        avatar_url: "/pro.png",
        filepath: "/pro.png",
        weather: false,
        country_name: "",
        iso_ode: "",
        city_name: "",
        latitude: "",
        longitude: ""
    })

    return (
        <Context.Provider value={[
            showSettings, setShowSettings, shortcutsPanel, setShortcutsPanel, settings, setSettings, saveButton, setSaveButton, settingsCopy, setSettingsCopy, warningPanel, setWarningPanel, warningPanel, setWarningPanel
        ]}>
            {children}
        </Context.Provider>
    );
}

export function useStateStoreContext() {
    return useContext(Context);

}
