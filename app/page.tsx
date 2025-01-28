"use client";
import Image from "next/image";
import React, { useState } from "react";
import axios from "axios";
import {
  BiCurrentLocation,
  BiHeart,
  BiSearch,
  BiSearchAlt,
  BiSolidEditLocation,
  BiWind,
} from "react-icons/bi";

const API_KEY = "0f8ca2f4ff712e4e9e189b30da0cbc64";

const page = () => {
  const date = new Date();
  const currentDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
      city === ''?setMsg('search cannot be empty')
      : setMsg(`Could not fetch weather details: ${error} `);
    }
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

  return (
    <div className="max-w-[90%] p-0 pt-20 lg:p-20 mx-auto relative  ">
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
              setCity(e.target.value), setMsg(''), setError(false);
            }}
            placeholder="Enter a City name"
            maxLength={40}
            className="bg-transparent cursor-pointer placeholder:text-[#ddd] w-full h-10 text-2xl outline-none border-none "
          />
          <button onClick={handleSearch} type="submit"  className="search-cta outline-none border-none bg-transparent cursor-pointer">
            <BiSearch />
          </button>
        </form>
      </div>
      <span className="text-red-600 " >{msg}</span>
    {weather ? (
      <div key={weather.dt} >
          <div className="today xl:flex-row flex-col flex items-center ">
        <div className="left-side text-center lg:text-left xl:mb-0 mb-20 mt-20 w-fit mx-auto xl:w-[30%] flex-1 ">
          <div className=" text-5xl tracking-wide text-white mb-5 sm:mb-0 ">Today </div>
          <div className="text-xl text-white flex items-end">
            {new Date(weather.dt * 1000).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric",})}{" "}
            <Image alt={"alt"} src={"/sun.jpg"} width={40} height={40} />{" "}
          </div>
          <div className="text-5xl text-white my-3 ">{weather.main.temp}&deg;C </div>
          <div className="text-white text-xl">{weather.weather[0].description}</div>
          <div className="flex mx-auto lg:mx-0 bg-white rounded-full my-3 items-center py-2 px-5 text-lg w-fit  ">
            {" "}
            <BiSolidEditLocation /> {weather.name}, {weather.sys.country}
          </div>
        </div>
        <div className="right-side overflow-x-scroll  w-full xl:w-fit flex">
          <div className="card h-40 mx-5 bg-slate-400 min-w-[120px] w-32 rounded-xl flex flex-col items-center ">
            <div className="pt-2 pb-4">Mon</div>
            <div className="icon">
              {" "}
              <Image alt={"alt"} src={"/sun.jpg"} width={60} height={60} />
            </div>
            <div>H: 60&deg;</div>
            <div>L: 75&deg;</div>
          </div>
        </div>
      </div>
      <div className="bottom-side">
        <div className="text-3xl text-white mt-10">Weather Details</div>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 my-5  ">
          <div className=" flex items-center justify-center text-xl py-3 rounded-xl bg-slate-400 bg-opacity-60  ">
            <div className="mr-5">
              <div>Wind Speed</div>
              <div>{weather.wind.speed * 2.23694}mph</div>
            </div>
            <div className=" text-5xl icon">
              <BiWind />
            </div>
          </div>
          <div className=" flex items-center justify-center text-xl py-3 rounded-xl bg-slate-400 bg-opacity-60  ">
            <div className="mr-5">
              <div>Visibility</div>
              <div>{weather.visibility / 1000}km</div>
            </div>
            <div className=" text-5xl icon">
              <BiWind />
            </div>
          </div>
          <div className=" flex items-center justify-center text-xl py-3 rounded-xl bg-slate-400 bg-opacity-60  ">
            <div className="mr-5">
              <div>Humidity</div>
              <div>{weather.main.humidity}%</div>
            </div>
            <div className=" text-5xl icon">
              <BiWind />
            </div>
          </div>
          <div className=" flex items-center justify-center text-xl py-3 rounded-xl bg-slate-400 bg-opacity-60  ">
            <div className="mr-5">
              <div>Sunrise</div>
              <div>{getTimeWithApPm(weather.sys.sunrise)}</div>
            </div>
            <div className=" text-5xl icon">
              <BiWind />
            </div>
          </div>
          <div className=" flex items-center justify-center text-xl py-3 rounded-xl bg-slate-400 bg-opacity-60  ">
            <div className="mr-5">
              <div>Sunset</div>
              <div>{getTimeWithApPm(weather.sys.sunset)}</div>
            </div>
            <div className=" text-5xl icon">
              <BiWind />
            </div>
          </div>
          <div className=" flex items-center justify-center text-xl py-3 rounded-xl bg-slate-400 bg-opacity-60  ">
            <div className="mr-5">
              <div>Wind Direction</div>
              <div>{getWindDirection(weather.wind.deg)}</div>
            </div>
            <div className=" text-5xl icon">
              <BiWind />
            </div>
          </div>
          <div className=" flex items-center justify-center text-xl py-3 rounded-xl bg-slate-400 bg-opacity-60  ">
            <div className="mr-5">
              <div>Wind Speed</div>
              <div>12.5mph</div>
            </div>
            <div className=" text-5xl icon">
              <BiWind />
            </div>
          </div>
          <div className=" flex items-center justify-center text-xl py-3 rounded-xl bg-slate-400 bg-opacity-60  ">
            <div className="mr-5">
              <div>Wind Speed</div>
              <div>12.5mph</div>
            </div>
            <div className=" text-5xl icon">
              <BiWind />
            </div>
          </div>
        </div>
      </div>
      </div>
    ): (error?  <div className="text-2xl my-10 text-white" ><span className="text-3xl" >Ooops!.....</span> Couldn't Check for "{city}", Try Again</div> : <div className="text-2xl my-10 text-white" >No data availaible</div> )
  }
      </div>
    )
};

export default page;