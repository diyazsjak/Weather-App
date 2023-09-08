const API_KEY = "d5a75bd487d14f13c64eabbf664cb5ad";

const btn = document.getElementById("btn");
const city_name = document.getElementById("city-input");

async function getWeather(city_name) {
    const weather_tags = document.getElementById("weather-info").children;
    for (let i = 0; i < weather_tags.length; i++) {
        weather_tags[i].innerHTML = "";
    }

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_KEY}&units=metric`);
    
    if (response.ok) {
        const weather_json = await response.json();

        let weather = weather_json["weather"][0]["main"];
        let temp = weather_json["main"]["temp"];
        let feels_like = weather_json["main"]["feels_like"]; 
        let humidity = weather_json["main"]["humidity"]; 
        let wind_speed = weather_json["wind"]["speed"];
        let clouds = weather_json["clouds"]["all"];

        let rain;
        if (!(rain = weather_json["rain"])) rain = "Rain: Isn't raining"; 
        else rain = `Rain: ${weather_json["rain"]["1h"]} mm`;

        document.getElementById("weather").append(`Weather: ${weather}`);
        document.getElementById("temp").append(`Temperature: ${temp} °`);
        document.getElementById("feels-like").append(`Feels like: ${feels_like} °`);
        document.getElementById("humidity").append(`Humidity: ${humidity} %`);
        document.getElementById("wind-speed").append(`Wind speed: ${wind_speed} m/s`);
        document.getElementById("rain").append(rain);
        document.getElementById("clouds").append(`Clouds: ${clouds} %`);
    }
    else {
        document.getElementById("error").innerHTML = `Error fetching: ${response.status}`;
    }
}

btn.addEventListener("click", ()=>{getWeather(city_name.value)});