import React, { useEffect, useState } from 'react'
import SettingsLayout from '../../layouts/settingsLayout'
import styles from '/styles/general.module.scss'
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import { Country, State, City } from 'country-state-city';

//global variable
import { useStateStoreContext } from "/layouts/stateStore"


export default function WeatherSettings() {
    const [showSettings, setShowSettings, shortcutsPanel, setShortcutsPanel, settings, setSettings, saveButton, setSaveButton, settingsCopy, setSettingsCopy, warningPanel, setWarningPanel] = useStateStoreContext();

    //Get the country
    const CountryArray = Country.getAllCountries();
    const [choosedCountry, setChoosedCountry] = useState({
        country_name: "",
        iso_ode: "",
    }
    );

    //Get the city
    const CityArray = City.getCitiesOfCountry(settings.iso_ode);



    return (
        <SettingsLayout title="Weather">

            <div className={styles.optionsVertical}>

                <div className={styles.optionsVertical}>

                    <div className={styles.details}>

                        <div className={styles.minititle}>
                            <div className={styles.title}>Show weather</div>
                        </div>
                        <div className={styles.discription}>Show the weather in the weak view.</div>

                    </div>

                    <div className={styles.toggleContainer}>
                        <input type="checkbox" name="toggle" id="toggle" className={styles.toggleInput}
                            onChange={() => {
                                setSettings({ ...settings, weather: !settings.weather })
                            }} checked={settings.weather}
                        />
                        <label htmlFor="toggle" className={styles.toggleLabel}></label>
                    </div>

                </div>

                <div className={settings.weather ? styles.unlock : styles.locked}>
                    <div className={styles.details}>

                        <div className={styles.minititle}>
                            City
                        </div>
                        <div className={styles.discription}>
                            choose your city to get the weather forecast for the next 5 days.
                        </div>

                    </div>



                    {/* choose country */}
                    <label htmlFor="country" className={styles.label}>Country</label>
                    <select name="country" id="country" className={styles.select}
                        onChange={(e) => {
                            setSettings({
                                ...settings,
                                country_name: e.target.value.split(",")[0],
                                iso_ode: e.target.value.split(",")[1]
                            })

                        }}
                    >
                        {CountryArray.map((country, index) => (
                            <option key={country.index}
                                value={
                                    [
                                        country.name,
                                        country.isoCode
                                    ]
                                }
                                selected={country.name === settings.country_name}
                            >
                                {country.name} ({country.isoCode})
                            </option>
                        ))}

                    </select>

                    {/* choose city */}
                    <label htmlFor="city" className={styles.label}>City</label>
                    <select name="city" id="city" className={styles.select}
                        onChange={(e) => {

                            setSettings({
                                ...settings,
                                city_name: e.target.value.split(",")[0],
                                latitude: e.target.value.split(",")[1],
                                longitude: e.target.value.split(",")[2]
                            })
                        }}
                    >

                        {CityArray.map((city, i) => (
                            <option key={i}
                                value={
                                    [
                                        city.name,
                                        city.latitude,
                                        city.longitude
                                    ]
                                }
                                selected={city.name === settings.city_name}
                            >
                                {city.name}
                            </option>
                        ))}
                    </select>
                    {settings.latitude !== "" && <p className={styles.latitude}>Latitude: {settings.latitude}</p>}
                    {settings.longitude !== "" && <p className={styles.longitude}>Longitude: {settings.longitude}</p>}
                </div>

            </div>

        </SettingsLayout >
    )
}
