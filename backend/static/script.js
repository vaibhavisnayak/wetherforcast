const apiKey = 'cb02c00e3a2d4244320d0652909cf5cf';

document.getElementById('searchBtn').addEventListener('click', () => {
  const city = document.getElementById('citySelect').value;
  if (city === '') {
    alert('Please select a city!');
    return;
  }
  getWeather(city);
});

function getWeather(city) {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  fetch(apiURL)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
      displayWeather(data, city);
    })
    .catch(error => {
      document.getElementById('weatherResult').innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
}

function displayWeather(data, city) {
  const weatherHTML = `
    <h2>${data.name}, ${data.sys.country}</h2> 
    <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
    <p><strong>Weather:</strong> ${data.weather[0].description}</p>
    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
    <button id="graphBtn" style="margin-top: 10px;">Get Forecast Graph</button>
    <div id="graphContainer"></div>
  `;
  document.getElementById('weatherResult').innerHTML = weatherHTML;

  // Add click listener for the newly added button
  document.getElementById('graphBtn').addEventListener('click', () => {
    showWeatherGraph(city);
  });
}

function showWeatherGraph(city) {
  const graphHTML = `
    <h3>Temperature Forecast (Next 24 Hours)</h3>
    <img src="/weather-graph?city=${encodeURIComponent(city)}" alt="Weather Graph" style="max-width:100%; margin-top:10px;">
  `;
  document.getElementById('graphContainer').innerHTML = graphHTML;
}
