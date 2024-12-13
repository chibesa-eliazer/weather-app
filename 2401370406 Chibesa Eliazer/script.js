const apiKey = '5d67ecca30bfa52b4c8fd153e8c94584';
document.addEventListener("DOMContentLoaded", () => {
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    getWeatherDataByCoords(latitude, longitude);
  });
});

async function getWeatherData(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    const data = await response.json();
    displayWeatherData(data);
    getForecastData(data.coord.lat, data.coord.lon);
  } catch (error) {
    alert("City not found");
  }
}

async function getWeatherDataByCoords(lat, lon) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
  const data = await response.json();
  displayWeatherData(data);
  getForecastData(lat, lon);
}

function displayWeatherData(data) {
  const cityName = document.getElementById('cityName');
  const temperature = document.getElementById('temperature');
  const weatherCondition = document.getElementById('weatherCondition');
  const humidity = document.getElementById('humidity');
  const windSpeed = document.getElementById('windSpeed');
  const weatherIcon = document.getElementById('weatherIcon');
  const localTime = document.getElementById('localTime');

  cityName.textContent = data.name;
  temperature.textContent = `Temperature: ${data.main.temp}°C`;
  weatherCondition.textContent = `Condition: ${data.weather[0].description}`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  const timezoneOffset = data.timezone;
  localTime.textContent = "Local Time: " + new Date(new Date().getTime() + timezoneOffset * 1000).toUTCString().slice(17, 25);

  updateBackground(data.weather[0].main);
}

function updateBackground(weather) {
  let backgroundUrl = 'images/pexels-fotios-photos-1921336.jpg';
  switch (weather.toLowerCase()) {
    case 'clear':
      backgroundUrl = 'url("images/sunny43.jpg")';
      break;
    case 'clouds':
      backgroundUrl = 'url("images/pexels-rodrigo-souza-1275988-2531709.jpg")';
      break;
    case 'rain':
      backgroundUrl = 'url("images/pexels-rfera-2618980.jpg")';
      break;
    default:
      backgroundUrl = 'url("images/pexels-fotios-photos-1921336.jpg")';
  }
  document.body.style.backgroundImage = backgroundUrl;
}

async function getForecastData(lat, lon) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
  const data = await response.json();
  displayForecast(data);
}

function displayForecast(data) {
  const forecastContainer = document.getElementById('forecast');
  forecastContainer.innerHTML = '';
  
  for (let i = 0; i < data.list.length; i += 8) {
    const dayData = data.list[i];
    const date = new Date(dayData.dt_txt).toLocaleDateString('en-GB', { weekday: 'short' });
    
    const forecastElement = document.createElement('div');
    forecastElement.classList.add('forecast-day');
    forecastElement.innerHTML = `
      <p>${date}</p>
      <img src="https://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png" alt="Icon">
      <p>${dayData.main.temp}°C</p>
    `;
    forecastContainer.appendChild(forecastElement);
  }
}

function searchWeather() {
  const cityInput = document.getElementById('cityInput').value;
  if (cityInput) {
    getWeatherData(cityInput);
  }
}
function openTab(event, tabName) {
  // Hide all tab contents
  const tabContents = document.getElementsByClassName("tab-content");
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].style.display = "none";
  }

  // Remove active class from all tab buttons
  const tabButtons = document.getElementsByClassName("tab-btn");
  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove("active");
  }

  // Show the selected tab content and add active class to the button
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.classList.add("active");
}

// Set the default tab to open
document.getElementsByClassName("tab-btn")[0].click();
