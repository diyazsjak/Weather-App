const API_KEY = "d5a75bd487d14f13c64eabbf664cb5ad";

const btn = document.getElementById("find-city-btn");
const cityInput = document.getElementById("city-input");
const error = document.getElementById("error");
let citySearchResults = document.getElementById("search-results");


async function getCityList() 
{
    /* 
     * Request list of cities and display them as options 
     * for an input when there's a change to the input form
     */
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityInput.value}&limit=5&appid=${API_KEY}`);

    citySearchResults.style.visibility = "visible";
    citySearchResults.innerHTML = "";

    if (response.ok) {
        const cityListJson = await response.json();

        for (let i = 0; i < cityListJson.length; i++) {
            let option = `${cityListJson[i]["name"]}, ${cityListJson[i]["country"]}`;
            let li = document.createElement("li");
            li.textContent = option;
            li.addEventListener("click", () => {
                cityInput.value = option;
                citySearchResults.innerHTML = "";
            });
            citySearchResults.appendChild(li);
        }
    }
}


async function getWeather() 
{
    /*
     * Request and display weather information
     */
    const weatherInfo = document.getElementById("weather-info").children;
    let weatherImg = document.getElementById("weather-img");

    // delete previously displayed information
    error.innerHTML = "";
    weatherImg.style.display = "none";  // in case of clearing all information
    for (let i = 0; i < weatherInfo.length; i++) {
        weatherInfo[i].innerHTML = "";
    }

    // return nothing if input is clear
    let cityInfo = cityInput.value.trim();  // remove whitespaces
    if (cityInfo == "") return;

    // check if user wrote country code to include it into request
    cityInfo = cityInfo.split(", ");
    const response = (cityInfo.length == 2)
        ? await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInfo[0]},${cityInfo[1]}&appid=${API_KEY}&units=metric`)
        : await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInfo[0]}&appid=${API_KEY}&units=metric`);
    
    if (response.ok) {
        const weatherJson = await response.json();

        let weather = weatherJson["weather"][0]["main"];
        let imgCode = weatherJson["weather"][0]["icon"];
        let temp = weatherJson["main"]["temp"];
        let feelsLike = weatherJson["main"]["feelsLike"]; 
        let humidity = weatherJson["main"]["humidity"]; 
        let windSpeed = weatherJson["wind"]["speed"];
        let clouds = weatherJson["clouds"]["all"];

        let rain;  // rain field may not be present
        if (!(rain = weatherJson["rain"])) rain = "Rain: Isn't raining"; 
        else rain = `Rain: ${weatherJson["rain"]["1h"]} mm`;

        // displaying information
        document.getElementById("weather").textContent = `Weather in ${weatherJson["name"]}, ${weatherJson["sys"]["country"]}: ${weather}`;
        document.getElementById("temp").textContent = `Temperature: ${temp} °`;
        document.getElementById("feels-like").textContent = `Feels like: ${feelsLike} °`;
        document.getElementById("humidity").textContent = `Humidity: ${humidity} %`;
        document.getElementById("wind-speed").textContent = `Wind speed: ${windSpeed} m/s`;
        document.getElementById("rain").textContent = rain;
        document.getElementById("clouds").textContent = `Clouds: ${clouds} %`;
        
        weatherImg.style.display = "initial";
        weatherImg.src = `https://openweathermap.org/img/wn/${imgCode}@2x.png`;
    }
    else {
        error.innerHTML = `Error fetching: ${response.status}`;
    }
}

let searchResultVisibility = function (event) {
    /*
     * show and hide search result list 
     * depending on cursor's position when clicked
     */
    let cursorIsOnCitySearchResults = citySearchResults.contains(event.target);
    let corsorIsOnCityInput = (cityInput.contains(event.target));
    if (!cursorIsOnCitySearchResults && !corsorIsOnCityInput) {
        citySearchResults.style.visibility = "hidden";
    }
    else if (corsorIsOnCityInput) {
        citySearchResults.style.visibility = "visible";
    }
}


document.addEventListener("click", searchResultVisibility);
cityInput.addEventListener("input", getCityList);  // calls when there's a change to the input
btn.addEventListener("click", ()=>{getWeather()});
