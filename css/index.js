const API_KEY = "d5a75bd487d14f13c64eabbf664cb5ad";

const btn = document.getElementById("btn");
const city_input = document.getElementById("city-input");
const error = document.getElementById("error");


async function getCityList() {
    /* 
        Request list of cities and display them as options for input
        when there's a change to the input form
    */
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city_input.value}&limit=5&appid=${API_KEY}`);

    if (response.ok) {
        const city_list_json = await response.json();
        const city_list_html = document.getElementById("city-list").children;

        for (let i = 0; i < city_list_html.length; i++) {
            let option_city = `${city_list_json[i]["name"]}, ${city_list_json[i]["country"]}`;
            if (city_input.value == option_city) break;
            city_list_html[i].value = option_city;
        }
    }
}


async function getWeather(city_name) {
    /*
        Request and display weather information for city_name
    */
    const weather_info = document.getElementById("weather-info").children;
    
    // delete previously displayed weather information 
    for (let i = 0; i < weather_info.length; i++) {
        weather_info[i].innerHTML = "";
    }
    // delete error message if it was previously displayed
    error.innerHTML = "";

    let tmp = city_name.split(", ");
    city_name = tmp[0];

    // check if user wrote country code to include it into request
    const response = (tmp.length == 2)
        ? await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city_name},${tmp[1]}&appid=${API_KEY}&units=metric`)
        : await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_KEY}&units=metric`);
    
    if (response.ok) {
        const weather_json = await response.json();

        let weather = weather_json["weather"][0]["main"];
        let temp = weather_json["main"]["temp"];
        let feels_like = weather_json["main"]["feels_like"]; 
        let humidity = weather_json["main"]["humidity"]; 
        let wind_speed = weather_json["wind"]["speed"];
        let clouds = weather_json["clouds"]["all"];

        let rain;  // rain field may not be present
        if (!(rain = weather_json["rain"])) rain = "Rain: Isn't raining"; 
        else rain = `Rain: ${weather_json["rain"]["1h"]} mm`;

        // displaying information
        document.getElementById("weather").innerHTML = `Weather in ${weather_json["name"]}, ${weather_json["sys"]["country"]}: ${weather}`;
        document.getElementById("temp").innerHTML = `Temperature: ${temp} °`;
        document.getElementById("feels-like").innerHTML = `Feels like: ${feels_like} °`;
        document.getElementById("humidity").innerHTML = `Humidity: ${humidity} %`;
        document.getElementById("wind-speed").innerHTML = `Wind speed: ${wind_speed} m/s`;
        document.getElementById("rain").innerHTML = rain;
        document.getElementById("clouds").innerHTML = `Clouds: ${clouds} %`;
    }
    else {
        error.innerHTML = `Error fetching: ${response.status}`;
    }
}


city_input.addEventListener("input", getCityList);  // calls when there's a change to the input
btn.addEventListener("click", ()=>{getWeather(city_input.value)});
