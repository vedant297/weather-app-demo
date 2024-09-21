const yourWeatherTab = document.querySelector('[your-weather]');
const searchWeatherTab = document.querySelector('[search-weather]');

const cityInputBox = document.querySelector('#search-city');
const grantLocationContainer = document.querySelector('.grant-location-container');
const weatherInfoContainer = document.querySelector('.weather-info-container');
const searchWeatherContainer = document.querySelector('.search-weather-form');
const loadingContainer = document.querySelector('.loading-container');
const grantLocationBtn = document.querySelector('[grant-location-btn]');
const errorMsg = document.querySelector('[error-desc]');
const errorContainer = document.querySelector('.error-container');


let currentTab = yourWeatherTab;

const weather_URL = `https://api.openweathermap.org/data/2.5/weather?`;
const API_KEY = `d1845658f92b31c64bd94f06f7188c9c`;

searchWeatherFromSessionStorage();

function switchTab( newTab){

    errorContainer.classList.remove('active');

    if (! newTab.classList.contains('current-tab')){

        currentTab.classList.remove('current-tab');

        currentTab = newTab;
        
        newTab.classList.add('current-tab');

        // check the tabs on which we are switching 

        // if search tab was the active now. That means we are moving to your weather tab.
        // in that case we will remove active class from searchWeather. Will fetchweather.
        if( searchWeatherContainer.classList.contains('active') ){

            searchWeatherContainer.classList.remove('active');
            weatherInfoContainer.classList.remove('active');

            searchWeatherFromSessionStorage();
        }
        else{

            searchWeatherContainer.classList.add('active');

            grantLocationContainer.classList.remove('active');
            loadingContainer.classList.remove('active');
            weatherInfoContainer.classList.remove('active');

        }
    }
}

yourWeatherTab.addEventListener('click' , (e) =>{

    switchTab(yourWeatherTab);
} );

searchWeatherTab.addEventListener('click' , (e) =>{

    switchTab(searchWeatherTab);
});

grantLocationBtn.addEventListener('click' ,(e) =>{

    getLocation();
});

searchWeatherContainer.addEventListener('submit' , (e) => {

    e.preventDefault();

    searchWeather();

    cityInputBox.value = "";
});

async function searchWeather() {

    try {
        
        let cityName = cityInputBox.value;
    
        if(! cityName) return;

        loadingContainer.classList.add('active');

        let response = await fetch( `${weather_URL}q=${cityName}&appid=${API_KEY}&units=metric`);
        let weatherValue = await response.json();

        if( ! weatherValue?.sys){
            throw weatherValue;
        }
        
        errorContainer.classList.remove('active');

        renderWeatherInfo(weatherValue);

    } catch (error) {
        
        loadingContainer.classList.remove('active');
        weatherInfoContainer.classList.remove('active');
        errorContainer.classList.add('active');

        errorMsg.innerText = error?.message;

        console.log('Error while fetching weather related details from searchWeather().');   
    }

}

function renderWeatherInfo( weatherDetails){

    let cityName = document.querySelector('[city-name]');
    let countryFlag = document.querySelector('[country-flag]');
    let weatherType = document.querySelector('[weather-type]');
    let weatherImg = document.querySelector('[weather-img]');
    let cityTemperature = document.querySelector('[city-temperature]');
    let windSpeed = document.querySelector('[wind-speed-value]');
    let humidity = document.querySelector('[humidity-value]');
    let clouds = document.querySelector('[clouds-value]');

    cityName.innerText = weatherDetails?.name;
    countryFlag.src = `https://flagcdn.com/144x108/${weatherDetails?.sys?.country.toLowerCase()}.png`;
    weatherType.innerText = weatherDetails?.weather?.[0]?.main;
    weatherImg.src = `http://openweathermap.org/img/w/${weatherDetails?.weather?.[0]?.icon.toLowerCase()}.png`;
    cityTemperature.innerText = `${weatherDetails?.main?.temp} °C`;
    windSpeed.innerText = `${ weatherDetails?.wind?.speed}m/s`;
    humidity.innerText = `${ weatherDetails?.main?.humidity}%`;
    clouds.innerText = `${weatherDetails?.clouds?.all}%`;

    loadingContainer.classList.remove('active');
    grantLocationContainer.classList.remove('active');
    weatherInfoContainer.classList.add('active');

}

function getLocation() {

    loadingContainer.classList.add('active');
    grantLocationContainer.classList.remove('active');
    
    if (navigator.geolocation) {
        
        navigator.geolocation.getCurrentPosition((position) => {
            
            const lat= position.coords.latitude;
            const lon= position.coords.longitude;

            const coordinates = JSON.stringify({ lat , lon});

            sessionStorage.setItem('coordinates' , coordinates);

            fetchUserWeather({ lat , lon});
        });
    } 
    
    else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function searchWeatherFromSessionStorage(){

    let coordinates = sessionStorage.getItem('coordinates');
    
    if( coordinates) {

        grantLocationContainer.classList.remove('active');
        loadingContainer.classList.add('active');

        let cords = JSON.parse( coordinates);
        fetchUserWeather( cords );
    }
    else{
        
        grantLocationContainer.classList.add('active');
    }
    
}

async function fetchUserWeather( coordinates){

    try {
        
        if ( ! coordinates.lat || !coordinates.lon ) return;
        
        let response = await fetch(`${weather_URL}lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}&units=metric`);

        let weatherValue = await response.json();

        renderWeatherInfo(weatherValue);

    } catch (error) {
        
        console.log(error);
        
    }
}

function showErrorMessage( errorMsg){
    
}