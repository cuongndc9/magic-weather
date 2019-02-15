require('dotenv').config()

const axios = require('axios')
const moment = require('moment')
const chalk = require('chalk')

const unit = require('./unit')
const icon = require('./icon')
const location = require('./location')
const time = require('./time')
const argv = require('yargs').argv
const log = console.log

const apiKey = process.env.API_KEY_WEATHER

const app = async () => {
	try {
		const city = argv.city || await location() || 'Ho Chi Minh City'
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

		const response = await axios.get(url)
    const weather = response.data

    const _location = '🌏 ' + weather.name + ', ' + weather.sys.country
    const timeByCity = await Date.parse(await time(city))
		const _time = '📅 ' + moment(timeByCity).format('dddd h:mm a')
		const description = icon.weather(weather.weather[0].icon) + '  ' + 
		weather.weather[0].description
		const temp = '🌡️  ' + unit.toFahrenheit(weather.main.temp) + ' °F'
		const duringTemp = '🌡️  ' + unit.toFahrenheit(weather.main.temp_min) + 
		' - ' + unit.toFahrenheit(weather.main.temp_max) + ' °F'
		const humidity = '💦 ' +  weather.main.humidity + ' %'
		const wind = '💨 ' + unit.toMph(weather.wind.speed) + ' mph'

		const message = `
			${chalk.blueBright(_location)}

			${chalk.greenBright(_time)}

			${chalk.yellowBright(description)}

			${chalk.redBright(temp)}

			${chalk.magentaBright(duringTemp)}

			${chalk.cyanBright(humidity)}

			${chalk.whiteBright(wind)}
		`

		log(message)
	} catch(err) {
		log(chalk.bgRedBright('Error when finding your weather.\nPlease try again!'))
	}
}

app()