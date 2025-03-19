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

  const handleChange = async () => {
    try {
      setLoading(true);
      setInput('');
      const data = await axios.get(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${input}&appid=${import.meta.env.VITE_OPEN_WEATHER_MAP_API}`);
      console.log(data);
      setResponse(data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching weather data');
    }
  };

  const getLocation = () => {
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
          } catch (error) {
            toast.error("Error fetching weather data");
          }
        },
        (error) => {
          toast.error(`Geolocation error: ${error.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,           
          maximumAge: 0,  
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };
  
  

  const clear = () => {
    setSelectBtn(true), 
    setSearchByName(false), 
    setSearchByLocation(false), 
    setResponse(null),
    setInput(''),
    setLoading(false)
  }  

  return (
    <div className='w-[300px] h-[460px] bg-gradient-to-r from-[#141e30] to-[#243b55] rounded-md absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]'>
      {
        selectBtn &&
        <div className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex justify-center gap-4 w-72 text-white border py-2 rounded-md'>
          <button onClick={ () => { setSearchByName(true), setSelectBtn(false) } } className='border-r pr-2'>Search by Name</button>
          <button onClick={ () => { setSearchByLocation(true), setSelectBtn(false) } } >Search by Location</button>
      </div>
      }
      {
        searchByName &&
        <>
          <div className='flex w-[280px] border rounded-full bg-gradient-to-r from-[#141e30] to-[#243b55] px-4 py-2 mt-6 mx-auto'>
            <input className='w-full outline-none px-2 bg-transparent placeholder:text-gray-600 text-white' type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter city name" />
            <button onClick={handleChange}><FaSearch className='text-white' /></button>
          </div>
          <FaArrowCircleLeft onClick={ clear } className='text-xl text-gray-300 mt-4 ml-3 cursor-pointer' />
        </>
      }
      {
        searchByLocation &&
        <>
          <div className='mt-6 text-center'>
            <button onClick={ getLocation } className='text-gray-300 border rounded-full px-4 py-2 text-center'>Get your weather by Location<MdOutlineMyLocation className='inline ml-2' /></button>
          </div>
          <FaArrowCircleLeft onClick={ clear } className='text-xl text-gray-300 mt-4 ml-3 cursor-pointer' />
        </>
      }
      {
        loading ? 
          <div className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]'>
            <TbLoader3 className='animate-spin text-4xl text-slate-300' />
          </div>
        :
        <div>
          {response && (
            <div className='text-center'>
                <img className='w-32 mx-auto relative' src={ `https://openweathermap.org/img/wn/${ response.weather[0].icon }@2x.png` } alt="" />
                <p className=' text-xl font-bold text-gray-400'>{response.weather[0].description.toUpperCase()}</p>
                <p className='text-4xl font-bold mt-3 text-white'>{Math.floor(response.main.temp)}°C</p>
                <p className='text-gray-500 mt-2'>Feels Like {Math.floor(response.main.feels_like)}°C</p>
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
          )}
        </div>
      }
    </div>
  );
};

export default App;
