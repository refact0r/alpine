import { twelveHour } from './utils.js'

export async function getWeather(config) {
    const res = await Promise.all([
        fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${config.weather.lat}&lon=${config.weather.lon}&appid=${config.weather.apiKey}&units=${config.weather.units}&cnt=4`
        ),
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${config.weather.lat}&lon=${config.weather.lon}&appid=${config.weather.apiKey}&units=${config.weather.units}`
        )
    ])

    if (!res[0].ok) {
        console.log(res)
        console.warn(
            'Failed to fetch from OpenWeatherMap. Check your API key and location.'
        )
        return []
    }

    const forecast = await res[0].json()
    const weatherNow = await res[1].json()
    const joined = [weatherNow, ...forecast.list.splice(0, 4)]
    console.log(joined)

    let weather = []
    for (let i = 0; i < 5; i++) {
        const dt = new Date(joined[i].dt * 1000)
        const hours = twelveHour(dt.getHours())
        const ampm = dt.getHours() >= 12 ? 'pm' : 'am'
        const isDay = joined[i].weather[0].icon[2] === 'd'

        weather.push({
            time: i === 0 ? `now` : `${hours}${ampm}`,
            temp: Math.round(joined[i].main.temp),
            icon: weatherIcon(joined[i].weather[0].id, isDay),
            description: joined[i].weather[0].description
        })
    }

    return weather
}

function weatherIcon(code, isDay) {
    if ((code >= 200 && code <= 202) || (code >= 230 && code <= 232)) {
        return 'thunderstorms-rain'
    } else if (code >= 210 && code <= 221) {
        return 'thunderstorms'
    } else if (code >= 300 && code <= 321) {
        return 'drizzle'
    } else if (code >= 500 && code <= 504) {
        return 'rain'
    } else if (code == 520 && code <= 531) {
        return isDay ? 'partly-cloudy-day-rain' : 'partly-cloudy-night-rain'
    } else if (code >= 600 && code <= 622) {
        return 'snow'
    } else if (code === 701) {
        return 'mist'
    } else if (code === 711) {
        return 'smoke'
    } else if (code === 721) {
        return 'haze'
    } else if (code === 731) {
        return 'dust-wind'
    } else if (code === 741) {
        return 'fog'
    } else if (code >= 751 && code <= 762) {
        return 'dust'
    } else if (code === 771) {
        return 'wind'
    } else if (code === 781) {
        return 'tornado'
    } else if (code === 801 || code === 802) {
        return isDay ? 'partly-cloudy-day' : 'partly-cloudy-night'
    } else if (code === 803) {
        return 'cloudy'
    } else if (code === 804) {
        return 'overcast'
    } else if (code === 800) {
        return isDay ? 'clear-day' : 'clear-night'
    } else {
        return 'not-available'
    }
}
