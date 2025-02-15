"use client";
import Image from "next/image";
import Head from "next/head";
import React, { useState } from "react";
import axios from "axios";
import {
  BiSearch,
  BiSolidEditLocation,
  BiShareAlt,
  BiShowAlt,
  
} from "react-icons/bi";
import { WiStrongWind, WiHumidity, WiSunset, WiSunrise, WiWindDeg } from "react-icons/wi";

const API_KEY = "0f8ca2f4ff712e4e9e189b30da0cbc64";

const Page = () => {
 /* const date = new Date();
  const currentDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });*/
  type CurrentWeather = {
    name: string;
    dt: number;
    main: {
      temp: number;
      humidity: number;
      feels_like: number;
      pressure: number;
    };
    wind: {
      speed: number;
      deg: number;
    };
    visibility: number;
    weather: [
      {
        description: string;
        icon: string;
      }
    ];
    sys: {
      country: string;
      sunrise: number;
      sunset: number;
    };
  };
  
  type ForecastWeather = {
    dt_txt: string;
    main: {
      temp: number;
      humidity: number;
      temp_min: number;
      temp_max: number;
    };
    weather: [
      {
        description: string;
        icon: string;
      }
    ];
  };
  
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [weatherForecast, setWeatherForecast] = useState<ForecastWeather[]>([]);
  
  const [error, setError] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>()

  const handleSearch = async () => {
    if(city === ''){
      setMsg('search cannot be empty')
    }
    try{
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
        const forecastCall = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
setWeather(response.data); 
setWeatherForecast(forecastCall.data.list); 


       console.log(weather)
       console.log(weatherForecast)
    } catch (error) {
      setError(true);
      city === ''
    ? setMsg('Search cannot be empty')
    : setMsg(`Could not fetch weather details: ${error}`); }
  };

  const getTimeWithApPm = (timestamp: number) =>{
    const date = new Date(timestamp * 1000)
    let hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()

    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12;
    hours = hours ? hours : 12;

    //format time as HH:MM:SS AM/PM
    const formattedTime = `${hours}:${minutes < 10? '0' + minutes : minutes} ${ampm}`

    return formattedTime;
  }

  const getWindDirection = (degree: number): string => {
    if (degree >= 337.5 || degree < 22.5) return "North (N)";
    if (degree >= 22.5 && degree < 67.5) return "Northeast (NE)";
    if (degree >= 67.5 && degree < 112.5) return "East (E)";
    if (degree >= 112.5 && degree < 157.5) return "Southeast (SE)";
    if (degree >= 157.5 && degree < 202.5) return "South (S)";
    if (degree >= 202.5 && degree < 247.5) return "Southwest (SW)";
    if (degree >= 247.5 && degree < 292.5) return "West (W)";
    if (degree >= 292.5 && degree < 337.5) return "Northwest (NW)";
    return "Invalid Direction";
  }


  const getDailyForecast = (weatherForecast: any[]) => {
    // Filter the forecast to only include data at 12:00 PM each day
    const dailyForecast = weatherForecast.filter((data) =>
      data.dt_txt.includes("12:00:00")
    );
  
    return dailyForecast.map((data) => ({
      date: data.dt_txt, // Full date string
      day: new Date(data.dt * 1000).toLocaleDateString("en-US", { weekday: "long" }), // Weekday name
      temp_max: data.main.temp_max, // Maximum temperature
      temp_min: data.main.temp_min, // Minimum temperature
      icon: data.weather[0].icon,
      description: data.weather[0].description, // Weather description
    }));}

    const fiveDayForecast = getDailyForecast(weatherForecast);

const shareData = {
  title: "check out my weather condition",
  text: `Location:${city}, 
Temperature: ${weather?.main?.temp ?? "N/A"}°C, 
check out other details at:`,
  url: "https://excellence-weather-app.vercel.app",
};


// Share must be triggered by "user activation"
const share = async () => {
  try {
    await navigator.share(shareData);
    
  } catch (err) {
    console.log(err)
  }
};


const getCustomWeatherIcon = (iconCode: string | undefined): string => {
  if (!iconCode) return "/default.png"; // Default icon if no code is provided

  const iconMap: { [key: string]: string } = {
    "01d": "/sunny.png",
    "01n": "/night-clear.png",
    "02d": "/partly-cloudy.png",
    "02n": "/night-cloudy.png",
    "03d": "/cloudy.png",
    "03n": "/cloudy.png",
    "04d": "/broken-clouds.png",
    "04n": "/broken-clouds.png",
    "09d": "/shower-rain.png",
    "09n": "/shower-rain.png",
    "10d": "/rain.png",
    "10n": "/night-rain.png",
    "11d": "/thunderstorm.png",
    "11n": "/thunderstorm.png",
    "13d": "/snow.png",
    "13n": "/snow.png",
    "50d": "/mist.png",
    "50n": "/mist.png",
  };

  return iconMap[iconCode] || "/weather.png"; // Return matching icon or default
};

  return (

     <>
        <Head>
          <title>Weather app</title>
      <link rel="icon" type="image/png" href='/partly-cloudy' />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Check live weather updates!" />
    </Head>
    
    <div className="max-w-[90%] p-0 pt-20 lg:p-20 mx-auto relative  ">
        <div
      onClick={() => {
        share();
      }}
      className={`p-3 text-3xl text-white bg-[black] ${weather? "block":"hidden"} fixed bottom-10 right-5 rounded-full`}
    >
      <BiShareAlt />
    </div>
      <div className="heading flex flex-col lg:flex-row-reverse  justify-between items-center  ">
        <div className="text-right text-3xl text-white mb-10 lg:mb-0 ">Weather App</div>
        <form
          onSubmit={(e) => {
  e.preventDefault();
          
  handleSearch();}} className="search border-b-2 w-[90%] sm:w-[60%] text-white items-end flex "
        >
          <input
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value), setMsg(''), setError(false), setWeather(null);
            }}
            placeholder="Enter a City name"
            maxLength={40}
            className="bg-transparent cursor-pointer placeholder:text-[#eee] w-full h-10 text-2xl outline-none border-none "
          />
          <button onClick={handleSearch} type="submit"  className="search-cta outline-none border-none bg-transparent text-2xl cursor-pointer">
            <BiSearch />
          </button>
        </form>
      </div>
      {/*<span className="text-red-600 " >{msg}</span>*/} {/*Developers can uncomment*/}
    {weather ? (
      <div key={weather.dt} >
          <div className="today xl:flex-row flex-col flex items-center ">
        <div className="left-side text-center lg:text-left xl:mb-0 mb-20 mt-20 w-fit mx-auto xl:w-[40%] flex-1 ">
          <div className=" text-5xl tracking-wide text-white mb-5 sm:mb-0 ">Today </div>
          <div className="text-xl text-white flex items-end">
            {new Date(weather.dt * 1000).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric",})}{" "}
            <Image 
  src={getCustomWeatherIcon(weather?.weather[0]?.icon)}
  alt={weather.weather[0].icon} 
  width={80} 
  height={80} 
/>
          </div>
          <div className="text-5xl text-white my-3 ">{weather.main.temp}&deg;C </div>
          <div className="text-white text-xl">{weather.weather[0].description}</div>
          <div className="flex mx-auto lg:mx-0 bg-white rounded-full my-3 items-center py-2 px-5 text-lg w-fit  ">
            {" "}
            <BiSolidEditLocation /> {weather.name}, {weather.sys.country}
          </div>
        </div>
            <div className="right-side overflow-x-scroll xl:w-[60%] w-full flex">
            {fiveDayForecast.map((forecast) => (
          <div key={forecast.date}  >
          <div className="card h-40 mx-3 sm:mx-5 bg-[white] bg-opacity-40 min-w-[120px] w-32 rounded-xl flex flex-col items-center ">
            <div className="pt-2 pb-4">{forecast.day}</div>
            <div className="icon">
              {" "}
              <Image 
  src={getCustomWeatherIcon(forecast.icon)}
  alt={forecast.icon} 
  width={60} 
  height={60} 
/>
            </div>
            <div>H: {forecast.temp_max}&deg;</div>
            <div>L: {forecast.temp_min}&deg;</div>
          </div>
        </div>

        ))}
            </div>
        
        
      </div>
      <div className="bottom-side">
        <div className="text-3xl text-white mt-10">Weather Details</div>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 my-5  ">
          <div className=" flex items-center justify-center text-lg sm:text-xl py-3 rounded-xl bg-[white] bg-opacity-40  ">
            <div className="mr-5 sm:flex-col gap-2 flex-row">
              <div>Wind Speed</div>
              <div>{Math.round(weather.wind.speed * 2.23694)}mph</div>
            </div>
            <div className=" text-4xl lg:text-5xl icon">
              <WiStrongWind />
            </div>
          </div>
          <div className="flex items-center justify-center text-lg sm:text-xl py-3 rounded-xl bg-[white] bg-opacity-40  ">
            <div className="mr-5 sm:flex-col gap-2 flex-row">
              <div>Visibility</div>
              <div>{weather.visibility / 1000}km</div>
            </div>
            <div className=" text-4xl lg:text-5xl icon">
              <BiShowAlt />
            </div>
          </div>
          <div className="flex items-center justify-center text-lg sm:text-xl py-3 rounded-xl bg-[white] bg-opacity-40  ">
            <div className="mr-5 sm:flex-col gap-2 flex-row">
              <div>Humidity</div>
              <div>{weather.main.humidity}%</div>
            </div>
            <div className=" text-4xl lg:text-5xl icon">
            <WiHumidity />
            </div>
          </div>
          <div className="flex items-center justify-center text-lg sm:text-xl py-3 rounded-xl bg-[white] bg-opacity-40  ">
            <div className="mr-5 sm:flex-col gap-2 flex-row">
              <div>Sunrise</div>
              <div>{getTimeWithApPm(weather.sys.sunrise)}</div>
            </div>
            <div className=" text-4xl lg:text-5xl icon">
              <WiSunrise />
            </div>
          </div>
          <div className="flex items-center justify-center text-lg sm:text-xl py-3 rounded-xl bg-[white] bg-opacity-40  ">
            <div className="mr-5 sm:flex-col gap-2 flex-row">
              <div>Sunset</div>
              <div>{getTimeWithApPm(weather.sys.sunset)}</div>
            </div>
            <div className=" text-4xl lg:text-5xl icon">
              <WiSunset />
            </div>
          </div>
          <div className=" flex items-center justify-center text-lg sm:text-xl py-3 rounded-xl bg-[white] bg-opacity-40  ">
            <div className="mr-5 sm:flex-col gap-2 flex-row">
              <div>Wind Direction</div>
              <div>{getWindDirection(weather.wind.deg)}</div>
            </div>
            <div className="text-4xl lg:text-5xl icon">
              <WiWindDeg />
            </div>
          </div>
        </div>
      </div>
      </div>
    ): (error?  <div className="text-2xl my-10 text-white" ><span className="text-3xl" >Ooops!.....</span> Couldn't Check for &quot;{city}&quot;, Try Again</div>
      : <div className="text-white my-10 text-center">
        <div className="mx-auto w-fit"><Image 
  src={"/search.png"} 
  alt={"search"} 
  width={250} 
  height={250} 
/></div>
        <div className="text-2xl font-semibold">Search for city</div>
        <div className="text-lg">Find out weather conditions of the city</div>
      </div> )
  }
      </div>
     </>
    )
};

export default Page;
