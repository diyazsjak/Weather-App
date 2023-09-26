const API_KEY = "d5a75bd487d14f13c64eabbf664cb5ad";

const btn = document.getElementById("find-city-btn");
const cityInput = document.getElementById("city-input");
const error = document.getElementById("error");
let citySearchResults = document.getElementById("search-results");


async function displayCityList() {
    /**
     * Request list of cities when there's a change 
     * to the input form and display them as options 
     */
    if (cityInput.value == "") {
        citySearchResults.innerHTML = "";
        citySearchResults.style.visibility = "hidden";
        return;
    }

    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityInput.value}&limit=3&appid=${API_KEY}`);

    if (response.ok) {
        citySearchResults.innerHTML = "";
        const cityListJson = await response.json();

        for (let i = 0; i < cityListJson.length; i++) {
            let city = cityListJson[i];

            let state = city["state"];
            let option = (state === undefined)  // state field could be not present
                ? `${city["name"]}, ${city["country"]}`
                : `${city["name"]}, ${state}, ${city["country"]}`;
            
            let li = document.createElement("li");
            li.textContent = option;
            li.addEventListener("click", () => {
                getWeather(null, [city["lat"], city["lon"]]);  // null is cus getWeather can be called from eventListenner
            });
            citySearchResults.appendChild(li);
            citySearchResults.style.visibility = "visible";
        }
    }
}

// Need to display location based on User input, instead of json name and counrty fields,
// cus api can provide different location on requested lat and lon or could not find a
// location on requested city and country(or state code), even if this location was in 
// options(providede by api)  
async function getWeather(e, coordinates = null) {
    /** 
     * Request weather information
     */
    const urlEnd = `&appid=${API_KEY}&units=metric`;
    citySearchResults.innerHTML = "";
    error.innerHTML = "";

    let cityInfo = cityInput.value.trim();      // remove whitespaces
    cityInput.value = "";                       // clear input
    if (cityInfo == "") return;                 // return nothing if input is clear
    
    cityInfo = cityInfo.split(", ");
    const url = (() => {
        if (coordinates == null) {
            // if input value wasn't selected from options(didn't get coordinates), get 
            // information by city name(check if state and country code were inputted)
            const urlWeatherByCity = `https://api.openweathermap.org/data/2.5/weather?q=${cityInfo[0]}`;

            switch (cityInfo.length) {
                case 1:
                    return urlWeatherByCity + urlEnd;
                case 2:
                    return urlWeatherByCity + `,${cityInfo[1]}` + urlEnd;
                case 3:
                    return urlWeatherByCity + `,${cityInfo[1]},${cityInfo[2]}` + urlEnd;
            }
        }
        else {
            let lat = coordinates[0];
            let lon = coordinates[1];
            coordinates = null;
            return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}` + urlEnd;
        }
    })();

    const response = await fetch(url);

    if (response.ok) {
        const json = await response.json();
        displayWeather(json);
    }
    else {
        error.innerHTML = `Error fetching: ${response.status}, ${response.statusText}`;
    }
}


function displayWeather(json) {
    /**
     * Display received weather information 
     */
    const weatherInfo = document.querySelector(".weather-info").children;
    const mainInfo = document.querySelector(".main-info").children;
    const secInfo = document.querySelector(".secondary-info").children;

    weatherInfo[0].textContent = `${json.name}, ${json.sys.country}`;

    mainInfo[0].children[0].textContent = `${json.main.temp.toFixed()}°`;
    mainInfo[0].children[2].textContent = `${json.weather[0].main}`;
    mainInfo[0].children[4].textContent = `Feels like ${json.main.feels_like.toFixed()}°`;
    
    mainInfo[1].src = `https://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png`;

    secInfo[0].children[0].textContent = `${json.main.humidity}%`;
    secInfo[1].children[0].textContent = json.wind.speed;
    secInfo[2].children[0].textContent = (json.rain != undefined) ? json.rain["1h"] : "-";
    secInfo[3].children[0].textContent = `${json.clouds.all}%`;

    secInfo[0].children[2].textContent = "Humidity";
    secInfo[1].children[2].textContent = "Wind(m/s)";
    secInfo[2].children[2].textContent = "Rain(mm)";
    secInfo[3].children[2].textContent = "Clouds";
    
    document.querySelector(".secondary-info").style.visibility = "visible";
}


let searchResultVisibility = function (event) {
    /**
     * show and hide search result list 
     * depending on cursor's position when clicked
     */
    let cursorIsOnCitySearchResults = citySearchResults.contains(event.target);
    let corsorIsOnCityInput = (cityInput.contains(event.target));
    if (!cursorIsOnCitySearchResults && !corsorIsOnCityInput) {
        citySearchResults.style.visibility = "hidden";
    }
    else if (corsorIsOnCityInput && (citySearchResults.innerHTML != "")) {
        citySearchResults.style.visibility = "visible";
    }
}


document.addEventListener("click", searchResultVisibility);
cityInput.addEventListener("input", displayCityList);  // calls when there's a change to the input
btn.addEventListener("click", getWeather);
