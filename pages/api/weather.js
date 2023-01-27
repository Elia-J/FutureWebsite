// This is an API route. It is not a page.

// A weather request is made to the OpenWeatherMap API and the response is returned to the client.
export default async function weather(req, res) {

    // Get the lat and lon from the request body. (latutude and longitude)
    const { lat, lon } = req.body

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`

    // Fetch the data from the OpenWeatherMap API
    const response = await fetch(url)
    const data = await response.json()

    // Return the data to the client as JSON
    res.status(200).json(data)
}