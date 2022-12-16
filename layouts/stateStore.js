import { createContext, useContext, useState } from "react";

const Context = createContext();


// settings show/hide
export function SettingsProvider({ children }) {

    const [showSettings, setShowSettings] = useState(false);

    return (
        <Context.Provider value={[showSettings, setShowSettings]}>
            {children}
        </Context.Provider>
    );
}

export function useSettingsContext() {
    return useContext(Context);
}
