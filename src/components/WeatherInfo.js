import React from "react";

function WeatherInfo({ data }) {
  return (
    <div>
      <div className="top">
        <div className="location">
          <p>{data.name}</p>
        </div>
        <div className="temp">
          {data.main ? <h1>{data.main.temp.toFixed()}ºF</h1> : null}
        </div>
        <div className="description">
          {data.weather ? <p>{data.weather[0].description}</p> : null}
        </div>
      </div>

      {data.main && (
        <div className="bottom">
          <div className="feels">
            {data.main ? (
              <p className="bold">{data.main.feels_like.toFixed()}ºF</p>
            ) : null}
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
  );
}

export default WeatherInfo;
