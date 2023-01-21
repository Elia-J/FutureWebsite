//create a weather api https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid= i want the reponse to be in json format

export default async function weather(req, res) {
    const { lat, lon } = req.body

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    const response = await fetch(url)
    const data = await response.json()
    res.status(200).json(data)
}