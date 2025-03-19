import axios from 'axios';
import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa";
import { FaArrowCircleLeft } from "react-icons/fa";
import { MdOutlineMyLocation } from "react-icons/md";
import toast from 'react-hot-toast';
import { TbLoader3 } from "react-icons/tb";

const App = () => {
  const [input, setInput] = useState('');

  const [response, setResponse] = useState(null);

  const [cords, setCords] = useState({
    latitude: '',
    longitude: ''
  })

  const [selectBtn, setSelectBtn] = useState(true);

  const [searchByName, setSearchByName] = useState(false);

  const [searchByLocation, setSearchByLocation] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const handleChange = async () => {
    try {
      setResponse(null);
      setLoading(true);
      setInput('');
      const data = await axios.get(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${input}&appid=${import.meta.env.VITE_OPEN_WEATHER_MAP_API}`);
      setResponse(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Error fetching weather data');
      setError("Enter a valid location and try again");
    }
  };

  const getLocation = () => {
    setResponse(null);
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCords({ latitude, longitude });
  
          try {
            const data = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${latitude}&lon=${longitude}&appid=${import.meta.env.VITE_OPEN_WEATHER_MAP_API}`
            );
            setResponse(data.data);
            setLoading(false);
          } catch (error) {
            toast.error("Error fetching weather data");
            setLoading(false);
            setError("Please try again");
          }
        },
        (error) => {
          setLoading(false);
          toast.error('Turn your Location On');
          setError("Turn your on Location before trying");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,           
          maximumAge: 0,  
        }
      );
    } else {
      setLoading(false);
      toast.error("Geolocation is not supported by this browser.");
      setError("Geolocation is not supported by this browser.");
    }
  };
  
  

  const clear = () => {
    setSelectBtn(true), 
    setSearchByName(false), 
    setSearchByLocation(false), 
    setResponse(null),
    setInput(''),
    setLoading(false),
    setError("");
  }  

  return (
    <div className='bg-gradient-to-r from-[#141e30] to-[#243b55] w-full h-[100vh]'>
      <div className='w-[320px] h-[480px] bg-gradient-to-r from-[#232526] to-[#414345] shadow-xl rounded-md absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]'>
        {
          selectBtn &&
          <div className='p-8'>
            <h1 className='text-orange-300 text-2xl font-bold text-center pt-5 animate-pulse'>Weather App</h1>
            <p className='text-slate-400 text-sm text-center pt-2'>Search by using your location name or can search by simply turning on your location</p>
            <div className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex justify-center gap-4 w-72 text-white border py-2 rounded-md'>
              <button onClick={ () => { setSearchByName(true), setSelectBtn(false) } } className='border-r pr-2'>Search by Name</button>
              <button onClick={ () => { setSearchByLocation(true), setSelectBtn(false) } } >Search by Location</button>
            </div>
            <p className='text-white absolute bottom-2 left-3 animate-pulse text-sm'>By, Irfan Ahamed S</p>
          </div>
        }
        {
          searchByName &&
          <>
            <div className='flex w-[280px] border rounded-full bg-gradient-to-r from-[#232526] to-[#414345] px-4 py-2 mt-10 mx-auto'>
              <input className='w-full outline-none px-2 bg-transparent placeholder:text-gray-500 text-white' type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter city name" />
              <button onClick={handleChange}><FaSearch className='text-white' /></button>
            </div>
            <FaArrowCircleLeft onClick={ clear } className='text-xl text-gray-300 mt-4 ml-6 cursor-pointer' />
          </>
        }
        {
          searchByLocation &&
          <>
            <div className='mt-10 text-center'>
              <button onClick={ getLocation } className='text-gray-300 border rounded-full px-4 py-2 text-center'>Get your weather by Location<MdOutlineMyLocation className='inline ml-2' /></button>
            </div>
            <FaArrowCircleLeft onClick={ clear } className='text-xl text-gray-300 mt-4 ml-6 cursor-pointer' />
          </>
        }
        {
          loading ? 
            <div className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]'>
              <TbLoader3 className='animate-spin text-4xl text-slate-300' />
            </div>
          :
          <div>
            {response ? (
              <div className='text-center'>
                  <img className='w-32 mx-auto relative' src={ `https://openweathermap.org/img/wn/${ response.weather[0].icon }@2x.png` } alt="" />
                  <p className=' text-xl font-bold text-gray-400'>{response.weather[0].description.toUpperCase()}</p>
                  <p className='text-4xl font-bold mt-3 text-white'>{Math.floor(response.main.temp)}°C</p>
                  <p className='text-gray-400 mt-2 font-semibold'>Feels Like {Math.floor(response.main.feels_like)}°C</p>
                  <h1 className='text-xl mt-2 font-[500] text-gray-300'>{response.name}</h1>
                  <div className='flex justify-around mt-4'>
                    <div className='flex items-center gap-2'>
                      <div>
                        <WiHumidity className='text-gray-200 text-2xl' />
                      </div>
                      <div className='text-start'>
                        <p className='text-white'>{response.main.humidity}</p>
                        <p className='text-gray-200 text-sm'>Humidity</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div>
                        <FaWind className='text-gray-200 text-2xl' />
                      </div>
                      <div className='text-start'>
                        <p className='text-white'>{response.wind.speed}</p>
                        <p className='text-gray-200 text-sm'>Wind Speed</p>
                      </div>
                    </div>
                  </div>
              </div>
            ) :
            <div className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-full'>
              {
                error && <p className='text-slate-200 text-center'>{ error }</p>
              }
            </div>
          }
          </div>
        }
      </div>
    </div>
  );
};

export default App;
