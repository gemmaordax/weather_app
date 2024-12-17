import React, { useState } from "react";
import axios from "axios";

function SearchForm({ onSearch }) {
  const [location, setLocation] = useState("");

  const apiKey = "1df652319f5df2c417341300f2be6219";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${apiKey}`;

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      axios.get(url)
        .then((response) => {
          onSearch(response.data);
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
      setLocation("");
    }
  };

  return (
    <input
      value={location}
      onChange={(event) => setLocation(event.target.value)}
      onKeyDown={searchLocation}
      placeholder="Enter Location"
      type="text"
    />
  );
}

export default SearchForm;
