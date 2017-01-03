var apiKey = "b094fb9f84b76d302eff8c4b1f135569";
var homeLatitude = 38.6751231;
var homeLongitude = -121.739676;
// var homeLatitude = 36.9189759;
// var homeLongitude = -116.7798523;
var geolocationError = false;
var geolocationUnsupported = false;
var currentLocation;
var showingCelsius = false;
$(document).ready(onLoad);

function onLoad()
{
  $("#conversion-button").on("click", onConversionButtonClick);
  
  if (navigator.geolocation)
  {
    navigator.geolocation.getCurrentPosition(getWeatherInfo,
      onNavigatorError);
  }
  else
    geolocationNotSupported();    
}

function getWeatherInfo(position) 
{
  geolocationDeclined = false;
  updateWeatherInfo(position.coords.latitude, position.coords.longitude);
}

function updateWeatherInfo(latitude, longitude)
{
  $.ajax(
    {
    url: "http://api.openweathermap.org/data/2.5/weather",
    crossDomain: true,
    type: "GET",
    format: "jsonp",
    data:
    {
      lat: latitude,
      lon: longitude,
      APPID: apiKey
    },
    success: function(location)
    {
      currentLocation = location;
      displayWeatherInfo();
      displayErrors();
      $(".container").show();
    },
    error: onError
  });
}

function kelvinToFahrenheit(kelvin)
{
  return Math.floor(kelvin * 9 / 5 - 459.67 + 0.5);
}

function kelvinToCelsius(kelvin)
{
  return Math.floor(kelvin - 273.15 + 0.5);
}

function displayWeatherInfo()
{
  $("#city-name-location").text("Current Weather for " +
    currentLocation.name + ", " + currentLocation.sys.country);
  
  // We call html() here instead of text() in order for the following
  // HTML attributes to be properly resolved.
  if (showingCelsius)
  {
    $("#temparature-location").html(
      kelvinToCelsius(currentLocation.main.temp) + "&#730;C");
    $("#conversion-button").html("C &#x2192; F");
  } 
  else
  {
    $("#temparature-location").html(
      kelvinToFahrenheit(currentLocation.main.temp) + "&#730;F");
    $("#conversion-button").html("F &#x2192; C");
  }
  
  $("#weather-icon-location").html(getWeatherIcon(
    currentLocation.weather[0].icon));
}

function displayErrors()
{
  if (geolocationUnsupported)
  {
    $("#error-icon-location").html(
      getErrorIcon("Geolocation not supported; using default location"));
    setInterval(toggleErrorIcon, 1000);
  }
  if (geolocationError)
  {
    $("#error-icon-location").html(
      getErrorIcon("Geolocation error; using default location"));
    setInterval(toggleErrorIcon, 1000);
  }
}

function onError(data)
{
  $("#city-name-location").html("Could not obtain weather data");
}

function geolocationNotSupported()
{
  geolocationUnsupported = true;
  updateWeatherInfo(homeLatitude, homeLongitude);
}

function onNavigatorError(error)
{
  geolocationError = true;
  updateWeatherInfo(homeLatitude, homeLongitude);
}

function lookupWeatherIconTooltip(id)
{
  if (id === "01d" || id === "01n")
    return "Clear";
  if (id === "02d" || id === "02n")
    return "Few clouds";
  if (id === "03d" || id === "03n")
    return "Scattered clouds";
  if (id === "04d" || id === "04n")
    return "Cloudy";
  if (id === "09d" || id === "09n")
    return "Showers";
  if (id === "10d" || id === "10n")
     return "Rain";
  if (id === "11d" || id === "11n")
     return "Thunderstorm";
  if (id === "13d" || id === "13n")
     return "Snow";
  if (id === "50d" || id === "50n")
     return "Mist";
  return "";
}

function getWeatherIcon(id)
{
  return "<img src=\"https://s3-us-west-2.amazonaws.com/s.cdpn.io/763768/" +
    id + ".svg\" width=\"100px\" data-toggle=\"tooltip\" title=\"" +
    lookupWeatherIconTooltip(id) + "\" />";
}

function getErrorIcon(tooltip)
{
   var html = "<img id=\"error-icon\" src=\"https://s3-us-west-2.amazonaws.com/s.cdpn.io/763768/warning_sign.svg\" width=\"30px\" alt=\"error\" data-toggle=\"tooltip\" ";
  if (tooltip && tooltip.trim().length > 0)
    html += "title=\"" + tooltip + "\"";
  html += "/>";
  return html;
}

function toggleErrorIcon()
{
  var icon = $("#error-icon");
  if (icon.css("opacity") == 1)
    icon.css("opacity", 0);
  else
    icon.css("opacity", 1);
}

function onConversionButtonClick()
{
  showingCelsius = !showingCelsius;
  displayWeatherInfo();
}

