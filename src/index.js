import "./styles.css";
import { parse, format } from "date-fns";

const apiKey = "aef5bd549b692fe0d5fd9e0e2b47b61e";
const contentContainer = document.querySelector(".content");
const searchInput = document.querySelector("input");
const searchBtn = document.querySelector(".search-button");
const changeTemperatureBtn = document.querySelector(".change-temperature-btn");
const cityNameText = document.querySelector(".city-name");
const weatherIconImg = document.querySelector(".weather-icon");
const weatherTemptureText = document.querySelector(".weather-temperature");
const minTemperatureText = document.querySelector(".min-temperature");
const maxTemperatureText = document.querySelector(".max-temperature");
const weatherText = document.querySelector(".weather-text");
const windText = document.querySelector(".wind-value");
const humidityText = document.querySelector(".humidity-value");
const cloudsText = document.querySelector(".clouds-value");
const feelsLikeText = document.querySelector(".feels-like-value");
const carousel = document.querySelector(".forecast");
const allWeatherElements = document.querySelectorAll(".weather-element");
const totalItems = allWeatherElements.length;
const weatherColors = {
  Clear:
    "linear-gradient(0deg, rgba(11,99,145,1) 0%, rgba(109,209,255,1) 100%)",
  Clouds:
    "linear-gradient(0deg, rgba(135,135,135,1) 0%, rgba(205,205,205,1) 100%)",
  Rain: "linear-gradient(0deg, rgba(2,61,107,1) 0%, rgba(0,95,244,1) 100%)",
  Snow: "linear-gradient(0deg, rgba(157,157,157,1) 0%, rgba(245,245,245,1) 100%)",
  Thunderstorm:
    "linear-gradient(0deg, rgba(94,94,94,1) 0%, rgba(103,103,103,1) 100%)",
  Drizzle: "linear-gradient(0deg, rgba(6,68,140,1) 0%, rgba(0,156,250,1) 100%)",
  Mist: "linear-gradient(0deg, rgba(135,135,135,1) 0%, rgba(205,205,205,1) 100%)",
};

let currentIndex = 0;
let temperatureDegrees = "celcius";

searchBtn.addEventListener("click", () => {
  const inputValue = searchInput.value;
  getActualWeather(inputValue);
  getForecast(inputValue);
});

async function getActualWeather(country) {
  try {
    const responseWeather = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${country}&units=metric&appid=${apiKey}`
    );
    const responseWeatherJson = await responseWeather.json();
    console.log(responseWeatherJson);

    const weatherCondition = responseWeatherJson.weather[0].main;
    const actualWeatherIcon = responseWeatherJson.weather[0].icon;
    const temperature = responseWeatherJson.main.temp;
    const minTemperature = responseWeatherJson.main.temp_min;
    const maxTemperature = responseWeatherJson.main.temp_max;
    const cityName = responseWeatherJson.name;
    const weather = responseWeatherJson.weather[0].description;
    const windSpeed = responseWeatherJson.wind.speed;
    const humidity = responseWeatherJson.main.humidity;
    const clouds = responseWeatherJson.clouds.all;
    const feelsLike = responseWeatherJson.main.feels_like;

    contentContainer.style.background = weatherColors[weatherCondition];
    cityNameText.textContent = cityName;
    weatherText.textContent =
      weather.charAt(0).toUpperCase() + weather.slice(1);
    weatherIconImg.src = `https://openweathermap.org/img/wn/${actualWeatherIcon}@2x.png`;
    weatherTemptureText.textContent = `${temperature.toFixed(1)}ºC`;
    minTemperatureText.textContent = `${minTemperature.toFixed(1)}ºC`;
    maxTemperatureText.textContent = `${maxTemperature.toFixed(1)}ºC`;
    windText.textContent = `${windSpeed.toFixed(0)} Km/h`;
    humidityText.textContent = `${humidity}%`;
    cloudsText.textContent = `${clouds}%`;
    feelsLikeText.textContent = `${feelsLike.toFixed(1)}ºC`;
  } catch (error) {
    console.log(error);
  }
}

async function getForecast(country) {
  try {
    const responseForecast = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${country}&units=metric&appid=${apiKey}`
    );
    const responseForecastJson = await responseForecast.json();
    console.log(responseForecastJson);

    displayForecast(responseForecastJson);
  } catch (error) {
    console.log(error);
  }
}

function displayForecast(response) {
  allWeatherElements[0].classList.add("selected");

  allWeatherElements.forEach((element) => {
    element.innerHTML = "";
  });

  carousel.style.transform = `translateX(0px)`;

  allWeatherElements.forEach((element, index) => {
    element.style.background =
      weatherColors[response.list[index].weather[0].main];

    const elementIcon = document.createElement("img");
    elementIcon.classList.add("weather-element-icon");
    const actualIcon = response.list[index].weather[0].icon;
    elementIcon.src = `https://openweathermap.org/img/wn/${actualIcon}@2x.png`;

    const elementTemperature = document.createElement("p");
    elementTemperature.classList.add("weather-element-temperature");
    elementTemperature.textContent = `${response.list[index].main.temp.toFixed(
      1
    )}ºC`;

    const elementDay = document.createElement("p");
    elementDay.classList.add("weather-element-day");
    const dateTimeString = response.list[index].dt_txt;
    const [dateString, timeString] = dateTimeString.split(" ");

    const date = parse(dateString, "yyyy-MM-dd", new Date());
    const time = parse(timeString, "HH:mm:ss", new Date());

    const formattedDate = format(date, "dd MMMM");
    const formattedTime = format(time, "HH:mm");

    elementDay.textContent = `${formattedDate} ${formattedTime}`;

    element.appendChild(elementIcon);
    element.appendChild(elementTemperature);
    element.appendChild(elementDay);
  });
}

// Función para mover el carrusel
function moveCarousel(moveStep) {
  allWeatherElements.forEach((element) => {
    element.classList.remove("selected");
  });

  currentIndex += moveStep;
  if (currentIndex >= totalItems) currentIndex = 0;
  if (currentIndex < 0) currentIndex = totalItems - 1;

  allWeatherElements[currentIndex].classList.add("selected");
  const itemWidth = allWeatherElements[0].offsetWidth + 20;
  const newTransform = currentIndex * itemWidth;
  carousel.style.transform = `translateX(-${newTransform}px)`;
}

async function changeTemperature() {
  const actualCountry = cityNameText.textContent;

  if (temperatureDegrees === "celcius") {
    try {
      const responseWeather = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${actualCountry}&units=imperial&appid=${apiKey}`
      );
      const responseWeatherJson = await responseWeather.json();
      weatherTemptureText.textContent = `${responseWeatherJson.main.temp.toFixed(
        1
      )}ºF`;
      minTemperatureText.textContent = `${responseWeatherJson.main.temp_min.toFixed(
        1
      )}ºF`;
      maxTemperatureText.textContent = `${responseWeatherJson.main.temp_max.toFixed(
        1
      )}ºF`;
      feelsLikeText.textContent = `${responseWeatherJson.main.feels_like.toFixed(
        1
      )}ºF`;
      changeTemperatureBtn.textContent = "Display ºC";

      const responseForecast = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${actualCountry}&units=imperial&appid=${apiKey}`
      );
      const responseForecastJson = await responseForecast.json();

      allWeatherElements.forEach((element, index) => {
        const temperatureText = element.querySelector(
          ".weather-element-temperature"
        );
        temperatureText.textContent = `${responseForecastJson.list[
          index
        ].main.temp.toFixed(1)}ºF`;
      });

      temperatureDegrees = "fahrenheit";
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const responseWeather = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${actualCountry}&units=metric&appid=${apiKey}`
      );
      const responseWeatherJson = await responseWeather.json();
      weatherTemptureText.textContent = `${responseWeatherJson.main.temp.toFixed(
        1
      )}ºC`;
      minTemperatureText.textContent = `${responseWeatherJson.main.temp_min.toFixed(
        1
      )}ºC`;
      maxTemperatureText.textContent = `${responseWeatherJson.main.temp_max.toFixed(
        1
      )}ºC`;
      feelsLikeText.textContent = `${responseWeatherJson.main.feels_like.toFixed(
        1
      )}ºC`;
      changeTemperatureBtn.textContent = "Display ºF";

      const responseForecast = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${actualCountry}&units=metric&appid=${apiKey}`
      );
      const responseForecastJson = await responseForecast.json();

      allWeatherElements.forEach((element, index) => {
        const allTemperatureText = document.querySelectorAll(
          ".weather-element-temperature"
        );
        allTemperatureText[index].textContent = `${responseForecastJson.list[
          index
        ].main.temp.toFixed(1)}ºC`;
      });

      temperatureDegrees = "celcius";
    } catch (error) {
      console.log(error);
    }
  }
}

// Event listeners para los botones
document
  .getElementById("right")
  .addEventListener("click", () => moveCarousel(1));
document
  .getElementById("left")
  .addEventListener("click", () => moveCarousel(-1));

changeTemperatureBtn.addEventListener("click", () => changeTemperature());

getActualWeather("buenos aires");
getForecast("buenos aires");
