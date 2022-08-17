var api_key = "9a890473fa5b28d71ed016387dd3738c"
var currentWeatherEl = document.getElementById("currentWeather")  // container for injecting current weather elements
var forecastWeatherEl = document.getElementById("forecastWeather")  // container for injecting forecast weather elements
var searchBarEl = document.getElementById("searchBar")  // container for injecting search history

var searchBtn = document.getElementById("search")  // button for exe search


// get previous searches from local storage, display to page
var storedCities = JSON.parse(localStorage.getItem("weather-app"))
if (storedCities) {
    // if available, loop through object and display each city
    newEl = document.createElement("h2")
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


function get_weather(city) {
    // get city name from coordinates
    var url_city = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api_key}`
    console.log("URL", url_city)

    fetch(url_city)
        .then(function(response) {
        return response.json();
        })
        .then(function(data) {
            var cityObj= data[0]
            console.log(data)

            console.log(cityObj)

            var lat = cityObj.lat
            var lon = cityObj.lon 
            var state = cityObj.state
            var country = cityObj.country
            var part = 'minutely,hourly,alerts'
            var units = 'imperial'
            var url_weather = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${part}&units=${units}&appid=${api_key}`
            console.log("URL", url_weather)

            fetch(url_weather)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                console.log(data);
                // pull current weather, add to html
                var dt_unix_0 = data.current.dt
                var dt_0 = dayjs.unix(dt_unix_0).format("MM-DD-YYYY")
                var temp_0 = data.current.temp
                var wind_0 = data.current.wind_speed
                var humidity_0 = data.current.humidity
                var uv_0 = data.current.uvi

                var icon_id = data.current.weather[0].icon
                var icon_url = `https://openweathermap.org/img/wn/${icon_id}@2x.png`

                // clear previous content
                currentWeatherEl.textContent = ""
                newEl = document.createElement("h2")
                newEl.textContent = ("Current Weather for " + city.charAt(0).toUpperCase() + city.slice(1) + ", " + state + ", " + country)
                newEl.setAttribute("class", "title")
                currentWeatherEl.appendChild(newEl)

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

                // newEl = document.createElement("h3")
                // newEl.textContent = (city.charAt(0).toUpperCase() + city.slice(1))
                // content.appendChild(newEl)

                // newEl = document.createElement("p")
                // newEl.textContent = (lat + ", " + lon)
                // currentWeatherEl.appendChild(newEl)

                newEl = document.createElement("h4")
                newEl.textContent = (dt_0)
                content.appendChild(newEl)
    
                newEl = document.createElement("p")
                newEl.textContent = ("Temperature [°F]: " + temp_0)
                content.appendChild(newEl)
    
                newEl = document.createElement("p")
                newEl.textContent = ("Wind Speed [mph]: " + wind_0)
                content.appendChild(newEl)
    
                newEl = document.createElement("p")
                newEl.textContent = ("Humidity [%]: " + humidity_0)
                content.appendChild(newEl)

    
                newEl = document.createElement("p")
                newEl.textContent = ("UV Index: " + uv_0)

                content.appendChild(newEl)

                // color code uvi based on value

                if (uv_0 > 7) {
                    //red
                    newEl.style.backgroundColor = "red"
                } else if (uv_0 > 5) {
                    // orange
                    newEl.style.backgroundColor = "orange"
                } else if (uv_0 > 2) {
                    // yellow
                    newEl.style.backgroundColor = "yellow"
                } else {
                    //green
                    newEl.style.backgroundColor = "green"
                }

                // add card to container
                currentWeatherEl.appendChild(card)

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

    
                // save new city to local storage, display on screen
                // does storedCities need to be called, or can reference outter scope?
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

                    localStorage.setItem("weather-app", JSON.stringify(storeCities));


                } else {
                    // create object for first time 
                    var storeCities = {
                        "1": city,
                        "2": "",
                        "3": "",
                        "4": "",
                        "5": "",

                    };

                    localStorage.setItem("weather-app", JSON.stringify(storeCities));
                }


    
                return;
            })
        })    
}

searchBtn.addEventListener("click", function(event) {
    var city = document.getElementById("cityInput").value  // input for city search
    if (city) {
        get_weather(city) 
    } else {
        console.log("No city entered")
    }
})

// get_weather("Bellingham")

