var api_key = "9a890473fa5b28d71ed016387dd3738c"

function get_weather(city) {
    if (city) {
        var url_city = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api_key}`
        fetch(url_city)
            .then(response => response.json())
            .then(data => setLocationDetails(city,data[0]))
        setDayDetails()
        //setForcast()
    } else {
        console.log('Please select city')
    }
}

function setLocationDetails(city,data) {
    const locInfo = {
        name: city,
        lat: data.lat,
        lon: data.lon,
        state: data.state,
        country: data.country,
        part: 'minutely,hourly,alerts',
        units: 'imperial',
    }
    localStorage.setItem("CurrentLocation", JSON.stringify(locInfo))
}

function setDayDetails() {
    var cityData = JSON.parse(localStorage.getItem("CurrentLocation"))
    var url_weather = `https://api.openweathermap.org/data/3.0/onecall?lat=${cityData.lat}&lon=${cityData.lon}&exclude=${cityData.part}&units=${cityData.units}&appid=${api_key}`
    fetch(url_weather)
        .then(response => response.json())
        .then(data => {
            var currentWeather = document.getElementById("currentWeather")
                   
            var time_current_unix = data.current.dt
            var time_current = dayjs.unix(time_current_unix).format("MM-DD-YYYY")
            var temp_current = data.current.temp
            var wind_current = data.current.wind_speed
            var humidity_current = data.current.humidity
            var uv_current = data.current.uvi
            var icon_id = data.current.weather[0].icon
            var icon_url = `https://openweathermap.org/img/wn/${icon_id}@2x.png`
                   
            // clear previous content
            currentWeather.textContent = ""
            newEl = document.createElement("h2")
            newEl.textContent = ("Current Weather for " + cityData.name.charAt(0).toUpperCase() + cityData.name.slice(1) + ", " + cityData.state + ", " + cityData.country)
            newEl.setAttribute("class", "title")
            currentWeather.appendChild(newEl)
            // create card for current weather
            card = document.createElement("div")
            card.setAttribute("class", "card")
            cardImgDiv = document.createElement("div")
            cardImgDiv.setAttribute("class", "card-image")
            cardImg = document.createElement("img")
            cardImg.setAttribute("src", icon_url)
            cardContent = document.createElement("div")
            cardContent.setAttribute("class", "card-content")
            content = document.createElement("div")
            content.setAttribute("class", "content")
            cardContent.appendChild(content)
            card.appendChild(cardImg)
            card.appendChild(cardContent)
            newEl = document.createElement("h4")
            newEl.textContent = (time_current)
            content.appendChild(newEl)
            newEl = document.createElement("p")
            newEl.textContent = ("Temperature [°F]: " + temp_current)
            content.appendChild(newEl)
            newEl = document.createElement("p")
            newEl.textContent = ("Wind Speed [mph]: " + wind_current)
            content.appendChild(newEl)
            newEl = document.createElement("p")
            newEl.textContent = ("Humidity [%]: " + humidity_current)
            content.appendChild(newEl)
            newEl = document.createElement("p")
            newEl.textContent = ("UV Index: " + uv_current)
            content.appendChild(newEl)
            // color code uvi based on value
            if (uv_current > 7) {
                newEl.style.backgroundColor = "red"
            } else if (uv_current > 5) {
                newEl.style.backgroundColor = "orange"
            } else if (uv_current > 2) {
                newEl.style.backgroundColor = "yellow"
            } else {
                newEl.style.backgroundColor = "green"
            }
            // add card to container
            currentWeather.appendChild(card)
        })
}

function setForcast() {
    var forecastWeatherEl = document.getElementById("forecastWeather")
    var cityData = JSON.parse(localStorage.getItem("CurrentLocation"))
    
    // set title for 5 day forecast
    forecastWeatherEl.textContent = ""
    newEl = document.createElement("h2")
    newEl.textContent = ("5 day forecast:")
    newEl.setAttribute("class", "title")
    forecastWeatherEl.appendChild(newEl)

    for (var i = 1; i < 6; i ++) {
        var dt_unix_1 = data.daily[i].dt
        var dt_1 = dayjs.unix(dt_unix_1).format("MM-DD-YYYY")

        var temp_1 = data.daily[i].temp.day
        var wind_1 = data.daily[i].wind_speed
        var humidity_1 = data.daily[i].humidity

        var icon_id = data.daily[i].weather[0].icon
        var icon_url = `https://openweathermap.org/img/wn/${icon_id}@2x.png`

        // create card
        card = document.createElement("div")
        card.setAttribute("class", "card square")

        cardImgDiv = document.createElement("div")
        cardImgDiv.setAttribute("class", "card-image")
        cardImg = document.createElement("img")
        cardImg.setAttribute("src", icon_url)

        cardContent = document.createElement("div")
        cardContent.setAttribute("class", "card-content")

        content = document.createElement("div")
        content.setAttribute("class", "content")

        cardContent.appendChild(content)
        card.appendChild(cardImg)
        card.appendChild(cardContent)

        // set content

        newEl = document.createElement("h4")
        newEl.textContent = (dt_1)
        content.appendChild(newEl)

        newEl = document.createElement("p")
        newEl.textContent = ("Temperature [°F]: " + temp_1)
        content.appendChild(newEl)

        newEl = document.createElement("p")
        newEl.textContent = ("Wind Speed [mph]: " + wind_1)
        content.appendChild(newEl)

        newEl = document.createElement("p")
        newEl.textContent = ("Humidity [%]: " + humidity_1)
        content.appendChild(newEl)

        forecastWeatherEl.appendChild(card)
    }
}

function storeCity(city) {
    var storedCities = JSON.parse(localStorage.getItem("weather-app"))
    if (storedCities) {
        console.log(storedCities)
        var storeCities = {
            "1": city,
            "2": storedCities["1"],
            "3": storedCities["2"],
            "4": storedCities["3"],
            "5": storedCities["4"], 
        }
        localStorage.setItem("weather-app", JSON.stringify(storeCities))
    } else {
        // create object for first time 
        var storeCities = {
            "1": city,
            "2": "",
            "3": "",
            "4": "",
            "5": ""
        }
        localStorage.setItem("weather-app", JSON.stringify(storeCities))
    }
}

function getActivityOutlook() {
    // get sunrise, sunset times from current, convert to hour
    var sunrise_unix_0 = data.current['sunrise']
    var sunset_unix_0 = data.current['sunset']
    // convert unix to hour
    //https://day.js.org/docs/en/display/format
    var sunrise_hr_0 = Number(dayjs.unix(sunrise_unix_0).format("H"))
    var sunset_hr_0 = Number(dayjs.unix(sunset_unix_0).format("H"))
    console.log(sunrise_hr_0)
    console.log(sunset_hr_0)
    // create array of hours from sunrise to sunset
    // Array.from(new Array(sunset_hr_0), (x, i) => i + sunrise_hr_0);
    // create object to fill with hourly parameters
    var hourly_data = []
    var hourly_sailing_rec_label = []
    var hourly_sailing_rec_data = []
    // loop through hourly data from sunrise to sunset
    for (var i = sunrise_hr_0; i < sunset_hr_0; i++){
        // get hourly data from object
        var temp_0 = data.hourly[i].temp
        var wind_0 = data.hourly[i].wind_speed
        var wind_deg_0 = data.hourly[i].wind_deg
        var wind_gust_0 = data.hourly[i].wind_gust
        var clouds_0 = data.hourly[i].clouds
        var sailing_rec_0 = 0;
        // todo create function to assess activty 
        if (temp_0 > 80 && temp_0 < 60) {
            sailing_rec_0 = 1
        } else if (wind_0 > 10 && wind_0 < 20) {
            sailing_rec_0 = 1
        } else if (clouds_0 < 1) {
            sailing_rec_0 = 1
        }
        
        var weather = {"hour": i, "temp": temp_0, "wind_speed": wind_0 , "wind_deg": wind_deg_0 , "wind_gust": wind_gust_0, "clouds": clouds_0, "sailing_rec": sailing_rec_0}
        hourly_data.push(weather)
        hourly_sailing_rec_label.push(i)
        hourly_sailing_rec_data.push(sailing_rec_0)
    };
    console.log(hourly_data)
    console.log(hourly_sailing_rec_label)
    console.log(hourly_sailing_rec_data)
}

var searchBtn = document.getElementById("search")
    searchBtn.addEventListener("click", (event) => {
        var city = document.getElementById("citySelect").value  // input for city search
        storeCity(city)
        get_weather(city)
})

// get previous searches from local storage, display to page
var searchBarEl = document.getElementById("prevSearch")
var storedCities = JSON.parse(localStorage.getItem("weather-app"))
if (storedCities) {
    // if available, loop through object and display each city
    var newEl = document.createElement("h2")
    newEl.textContent = ("Recent Searches: ")
    searchBarEl.appendChild(newEl)

    var storedCitiesVal = Object.values(storedCities)
    for (var i = 0; i < storedCitiesVal.length; i++ ) {

        newEl = document.createElement("p")
        var storedCity = storedCitiesVal[i]
        newEl.textContent = (storedCity.charAt(0).toUpperCase() + storedCity.slice(1))
        newEl.setAttribute("class", "link")
        newEl.addEventListener("click", function(event) {
            get_weather(event.target.innerText)
        })
        
        searchBarEl.appendChild(newEl)
    }

} else {
    console.log('no local data')
}