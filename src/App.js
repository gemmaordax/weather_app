import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import backgroundIMG from "./img/fondo.jpg";

function App() {
  const [location, setLocation] = useState(""); 
  const [data, setData] = useState({}); 
  const [imageUrl, setImageUrl] = useState(""); 
  const [error, setError] = useState(""); 
  const [isInitialLoad, setIsInitialLoad] = useState(true); 
  const [isTransitioning, setIsTransitioning] = useState(false); 

  const apiKey = "1df652319f5df2c417341300f2be6219";
  const unsplashApiKey = "HBcx7bhebHHyqhe5D5FiqKelzjMopNib7fe7LY5-7i8";

  // Función para obtener clima por coordenadas
  const fetchWeatherByCoords = useCallback((lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    
    axios.get(url)
      .then((response) => {
        setData(response.data);
        setLocation(`${response.data.name}, ${response.data.sys.country}`);
        fetchImage(response.data.name);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  }, []); 

  // Función para obtener imagen de Unsplash basada en el nombre del lugar
  const fetchImage = (cityName) => {
    const query = cityName.toLowerCase().replace(" ", "+");
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${query}&client_id=${unsplashApiKey}&orientation=landscape`;

    axios.get(unsplashUrl)
      .then((response) => {
        if (response.data.results.length > 0) {
          setIsTransitioning(true);
          setImageUrl(response.data.results[0].urls.regular);
        } else {
          setImageUrl(backgroundIMG);
        }
      })
      .catch((error) => {
        console.error("Error fetching image from Unsplash:", error);
        setImageUrl(backgroundIMG);
      });
  };

  // Obtener ubicación actual del usuario al cargar la página
  useEffect(() => {
    if (isInitialLoad && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchWeatherByCoords(lat, lon);
          setIsInitialLoad(false); 
        },
        (error) => {
          setError("Unable to retrieve your location.");
          console.error("Error getting geolocation", error);
        }
      );
    }
  }, [isInitialLoad, fetchWeatherByCoords]);

  // Búsqueda manual por ubicación
  const searchLocation = (event) => {
    if (event.key === "Enter") {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${apiKey}`;
      
      axios.get(url)
        .then((response) => {
          setData(response.data);
          fetchImage(response.data.name);  
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
      setLocation("");  
    }
  };

  // Controlar la transición de la imagen de fondo
  useEffect(() => {
    if (isTransitioning) {
      const transitionEnd = setTimeout(() => {
        setIsTransitioning(false);
      }, 1000); 
      return () => clearTimeout(transitionEnd);
    }
  }, [isTransitioning]);

  return (
    <div className={`app ${isTransitioning ? 'transitioning' : ''}`} style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover' }}>
      <div className="container">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyDown={searchLocation}
          placeholder="Enter Location"
          type="text"
        />

        {error && <p>{error}</p>}

        <div className="top">
          <div className="location">
            <p>{data.name ? `${data.name}, ${data.sys?.country}` : "Loading location..."}</p>
          </div>
          <div className="temp">
            {data.main ? <h1>{data.main.temp.toFixed()}°F</h1> : null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].description}</p> : null}
          </div>
        </div>

        {data.main && (
          <div className="bottom">
            <div className="feels">
              {data.main ? <p className="bold">{data.main.feels_like.toFixed()}°F</p> : null}
              <p>Feels like</p>
            </div>
            <div className="humidity">
              {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? <p className="bold">{data.wind.speed.toFixed()} MPH</p> : null}
              <p>Wind</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
