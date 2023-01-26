import Image from 'next/image';
import React, { useState } from 'react'
import styles from '../styles/icons.module.scss'

import { useStateStoreEventsContext } from "/layouts/stateStoreEvents"

const iconOptions = [
    { name: "fi-sr-asterik", path: "/icons/fi-sr-asterik.svg" },
    { name: "fi-sr-balloons", path: "/icons/fi-sr-balloons.svg" },
    { name: "fi-sr-bank", path: "/icons/fi-sr-bank.svg" },
    { name: "fi-sr-bookmark", path: "/icons/fi-sr-bookmark.svg" },
    { name: "fi-sr-bowling", path: "/icons/fi-sr-bowling.svg" },
    { name: "fi-sr-gamepad", path: "/icons/fi-sr-gamepad.svg" },
    { name: "fi-sr-guitar", path: "/icons/fi-sr-guitar.svg" },
    { name: "fi-sr-makeup-brush", path: "/icons/fi-sr-makeup-brush.svg" },
    { name: "fi-sr-phone-call", path: "/icons/fi-sr-phone-call.svg" },
    { name: "fi-sr-ping-pong", path: "/icons/fi-sr-ping-pong.svg" },
    { name: "fi-sr-pizza-slice", path: "/icons/fi-sr-pizza-slice.svg" },
    { name: "fi-sr-print", path: "/icons/fi-sr-print.svg" },
    { name: "fi-sr-salad", path: "/icons/fi-sr-salad.svg" },
    { name: "fi-sr-scale", path: "/icons/fi-sr-scale.svg" },
    { name: "fi-sr-school-bus", path: "/icons/fi-sr-school-bus.svg" },
    { name: "fi-sr-school", path: "/icons/fi-sr-school.svg" },
    { name: "fi-sr-shield-check", path: "/icons/fi-sr-shield-check.svg" },
    { name: "fi-sr-shopping-cart", path: "/icons/fi-sr-shopping-cart.svg" },
    { name: "fi-sr-thumbtack", path: "/icons/fi-sr-thumbtack.svg" },
    { name: "fi-sr-train", path: "/icons/fi-sr-train.svg" },
    { name: "fi-sr-utensils", path: "/icons/fi-sr-utensils.svg" },


]


export default function Icons() {
    const [eventsPanel, setEventsPanel, input, setinput] = useStateStoreEventsContext()


    const handleIconChange = (e) => {
        const data = iconOptions.find((icon) => icon.name === e.target.value);

        setinput({ ...input, icon: data.path })
    }


    return (
        <div className={styles.componentIcons}>
            {/* create a grid layout to display the icon and click on them */}
            <div className={styles.container}>
                {iconOptions.map((icon) => (
                    <div key={icon.name} className={styles.icon}>
                        <input
                            id={icon.name}
                            type="radio"
                            name="icon"
                            value={icon.name}
                            checked={input?.icon === icon?.path}
                            onChange={handleIconChange}
                            className={styles.iconInput}
                        />
                        {/* image */}
                        <label htmlFor={icon.name} className={styles.iconLabel}>
                            <div className={styles.image}>
                                <Image
                                    src={icon.path}
                                    alt={icon.name}
                                    fill
                                />
                            </div>
                        </label>

                    </div>
                ))}

            </div>
        </div>
    )
}
