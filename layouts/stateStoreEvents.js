import { createContext, useContext, useState } from "react";

const Context = createContext();


// settings show/hide
export function EventProvider({ children }) {

    const [eventsPanel, setEventsPanel] = useState(false);
    const [input, setinput] = useState({
        id: "",
        title: "",
        description: "",
        allDay: false,

        //style
        backgroundColor: "#4c7987",
        icon: "",

        //time
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",

        //repeat
        activeRecur: false,
        daysOfWeek: [],
    })

    return (
        <Context.Provider value={[
            eventsPanel, setEventsPanel, input, setinput
        ]}>
            {children}
        </Context.Provider>
    );
}

export function useStateStoreEventsContext() {
    return useContext(Context);

}
