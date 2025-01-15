import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

export default function GoogleMap({ countries }) {
  const [pins, setPins] = useState([]); // State to store pins

  const getPins = async (countries) => {
    const pinPromises = countries.map(async (country) => {
      console.log(country);
      const cn = country.zoneName.replace("/", "%2F"); // Ensure proper encoding
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${cn}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`);
      const data = await response.json();
      
      // Check if data.results is not empty and if geometry exists
      if (data.results && data.results[0] && data.results[0].geometry) {
        return data.results[0]; // Return the valid pin data
      } else {
        console.warn(`No valid geometry found for country: ${country.zoneName}`);
        return null; // Return null for invalid data
      }
    });

    // Wait for all promises to resolve and filter out any null values
    const results = await Promise.all(pinPromises);
    setPins(results.filter(pin => pin !== null)); // Update state with valid pin data
  };

  useEffect(() => {
    if (countries.length > 0) {
      getPins(countries);
      console.log(countries); // Check countries array
    }
  }, [countries]); // Re-run the effect when countries prop changes

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        style={{ width: '80vw', height: '60vh' }}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        defaultZoom={3}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        {pins.map((pin, index) => (
          <Marker
            key={index}
            position={{
              lat: pin.geometry.location.lat,
              lng: pin.geometry.location.lng,
            }}
          />
        ))}
      </Map>
    </APIProvider>
  );
}
