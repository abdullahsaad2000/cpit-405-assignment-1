const XHRbutton = document.getElementById("xhr-button");
const fetchbutton = document.getElementById("fetch-button");
const asyncbutton = document.getElementById("async-button");
const APIKEY = "2a176afb3793dff4abec356fe07500f4";
XHRbutton.addEventListener("click" , function(){
  const searchWord = document.getElementById("search-query").value;
  searchXHR(searchWord);
} );
fetchbutton.addEventListener("click" , function(){
  const searchWord = document.getElementById("search-query").value;
  searchFetch(searchWord);
} );
asyncbutton.addEventListener("click" , function(){
  const searchWord = document.getElementById("search-query").value;
searchasyncawait(searchWord);
} );

function getWeatherInfo(lat, lon, callback) {
const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${APIKEY}`;
const xhr = new XMLHttpRequest();
xhr.open("GET", url, true);
xhr.onload = function () {
  if (xhr.status >= 200 && xhr.status < 400 ) {
    const data = JSON.parse(xhr.responseText);
    callback(null, data);
  } else {
    callback(new Error("Error happend during load weather data."));
  }
};
xhr.onerror = function () {
  callback(new Error("Error Happend."));
};
xhr.send();
}

function searchXHR(citySearch){
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(citySearch)}&limit=1&appid=${APIKEY}`;
let XHRSearch = new XMLHttpRequest();
XHRSearch.open("Get", geoUrl, true);
XHRSearch.onload = function() {
  if (XHRSearch.status >= 200 && XHRSearch.status < 400){
    let locationsResp = JSON.parse(XHRSearch.responseText);
    if (locationsResp.length > 0 ) {
      getWeatherInfo(locationsResp[0].lat, locationsResp[0].lon, displayWeatherInfo);
    } else {
      console.error("City not found.");
    }
    
  } else {
    console.error("Error during Request....");
  }
};

XHRSearch.onerror = function() {
  console.error("Network Error");
};
XHRSearch.send();
}

function searchFetch (citySearch){
fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(citySearch)}&limit=1&appid=${APIKEY}`)
.then(response => response.json())
.then(Geolocations => {
  if(Geolocations.length > 0 ){
    return fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${Geolocations[0].lat}&lon=${Geolocations[0].lon}&exclude=minutely,hourly,daily,alerts&appid=${APIKEY}`);
  } else {
    throw new Error("City not found");
  }
  
})
.then(response => response.json())
.then(data => displayWeatherInfo(null, data))
.catch(error => {
  console.error("There is a problem in fetch operation....")
})
}

async function searchasyncawait(citySearch){
  try {
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(citySearch)}&limit=1&appid=${APIKEY}`);
    const Geolocations = await response.json();
    if (Geolocations.length > 0) {
      const weatherResp = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${Geolocations[0].lat}&lon=${Geolocations[0].lon}&exclude=minutely,hourly,daily,alerts&appid=${APIKEY}`);
      const weatherInfo = await weatherResp.json();
      displayWeatherInfo(null, weatherInfo);
    } else {
      throw new Error("City not found");
    }
  } catch (error) {
    console.error("Error Happend....")
  }
}


function displayWeatherInfo(error, data) {
let DivInfo = document.getElementById("weather-info");
DivInfo.innerHTML = "";
if (error) {
  console.error("Error Happend.");
} else {
  const { weatherCurrent } = data;
  const weatherInfo = `
  <p>Temperature: ${weatherCurrent.temp}K</p>
  <p>Feels like: ${weatherCurrent.feels_like}K</p>
  <p>Humidity: ${weatherCurrent.humidity}%</p>
  <p>Wind Speed: ${weatherCurrent.wind_speed} m/s</p>
  <p>Weather: ${weatherCurrent.weather[0].description}</p>
  `;
  DivInfo.innerHTML = weatherInfo;
}


}








