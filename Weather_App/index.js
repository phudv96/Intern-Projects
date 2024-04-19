const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey="f2f859a6a57bc25f4bb200507d9452d3";

weatherForm.addEventListener("submit", async event=>{
    event.preventDefault();

    const city=cityInput.value;
    if(city){
        try{
            const weatherData=await getWeatherData(city);
            displayWeatherInfo(weatherData);
        }
        catch(error){
            console.error(error);
            displayError("Seem like the city isn't available");
        }
    }
    else {
        displayError("Please enter a city");
    }
});

async function getWeatherData(city){
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiURL);

    if(!response.ok){
        throw new Error("Could not find the city data");
    }
    return await response.json();
}

function displayWeatherInfo(data){
    const {name: city, main:{temp, humidity}, weather: [{description, icon}]} = data;
    card.textContent="";
    card.style.display="flex";
    const cityDisplay=document.createElement("h1");
    const tempDisplay=document.createElement("p");
    const humidityDisplay=document.createElement("p");
    const descDisplay=document.createElement("p");
    const weatherEmoji=document.createElement("img");
    
    cityDisplay.textContent=city;
    tempDisplay.textContent=`${(temp-272.15).toFixed(1)}°C`
    humidityDisplay.textContent=`Humidity: ${humidity}%`;
    descDisplay.textContent=description;
    weatherEmoji.src=getWeatherEmoji(icon);

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    //weatherEmoji.classList.add("weatherEmoji");

    card.append(cityDisplay);
    card.append(tempDisplay);
    card.append(humidityDisplay);
    card.append(descDisplay);
    card.append(weatherEmoji);

    console.log(data);

}

function getWeatherEmoji(weatherID){
    return `https://openweathermap.org/img/wn/${weatherID}.png`
}

function displayError(message){

    const errorMessage=document.createElement("p");
    errorMessage.textContent=message;
    errorMessage.classList.add("errorDisplay");

    card.textContent="";
    card.style.display="flex";
    card.append(errorMessage);
}