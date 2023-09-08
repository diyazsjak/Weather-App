const API_KEY = "d5a75bd487d14f13c64eabbf664cb5ad";

const weather_info = document.querySelector("#weather-info");
const btn = document.getElementById("btn");
const city_name = document.getElementById("city-input");

async function getWeather(city_name) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_KEY}&units=metric`);
    
    if (response.ok) {
        const weather_info = await response.json();

        let weather = weather_info["weather"][0]["main"];
        let temp = weather_info["main"]["temp"];
        let feels_like = weather_info["main"]["feels_like"]; 
        let humidity = weather_info["main"]["humidity"]; 
        let wind_speed = weather_info["wind"]["speed"];
        let clouds = weather_info["clouds"]["all"];

        document.getElementById("weather").append(weather);
        document.getElementById("temp").append(temp);
        document.getElementById("feels-like").append(feels_like);
        document.getElementById("humidity").append(humidity);
        document.getElementById("wind-speed").append(wind_speed);
        document.getElementById("clouds").append(clouds);
    }
    else {
        return document.getElementById("error").innerHTML = "Error fetching";
    }
}

btn.addEventListener("click", ()=>{getWeather(city_name.value)});