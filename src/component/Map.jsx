import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { fallback } from "../assets";

const API_KEY = import.meta.env.VITE_GOOGLE_MAP_KEY;

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "10px",
};

const defaultCoordinates = { lat: 24.8607, lng: 67.0011 }; // Karachi

const MapComponent = ({ data }) => {
  const navigate = useNavigate(); // Hook to navigate to card pages
  const [center, setCenter] = useState(defaultCoordinates);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [map, setMap] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
  });

  // Check if data is available and not empty
  if (!data || data.length === 0) {
    return <div>No data available to display</div>;
  }

  const validCoordinates = data
    .map((item) => ({
      lat: parseFloat(item.longitude.trim()),
      lng: parseFloat(item.latitude.trim()),
      title: item.title,
      location: item.location,
      id: item.id, // Assuming each item has an ID for navigation
      images: item.images || fallback, // Use the first gallery image or fallback
      rating: item.rating || "N/A",
    }))
    .filter((item) => !isNaN(item.lat) && !isNaN(item.lng));

  useEffect(() => {
    if (validCoordinates.length > 0 && map) {
      const bounds = new window.google.maps.LatLngBounds();
      validCoordinates.forEach((coord) =>
        bounds.extend({ lat: coord.lat, lng: coord.lng })
      );
      map.fitBounds(bounds); // Adjust the map to fit all markers
    }
  }, [map, validCoordinates]);

  const handleMarkerClick = useCallback((lat, lng, title, location, id) => {
    setCenter({ lat, lng });
    setSelectedMarker({ lat, lng, title, location, id });
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <div className="flex flex-col">
      <div className="map-wrapper w-full" style={{ height: "400px" }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          onLoad={(mapInstance) => setMap(mapInstance)}
          options={{ disableDefaultUI: true }}
        >
          {validCoordinates.map((item, index) => (
            <Marker
              key={index}
              position={{ lat: item.lat, lng: item.lng }}
              title={item.title}
              onClick={() =>
                handleMarkerClick(
                  item.lat,
                  item.lng,
                  item.title,
                  item.location,
                  item.id
                )
              }
            >
              {selectedMarker &&
                selectedMarker.lat === item.lat &&
                selectedMarker.lng === item.lng && (
                  <InfoWindow
                    position={{ lat: item.lat, lng: item.lng }}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div className="">
                      <img
                        src={item.images}
                        alt={item.title}
                        className="h-12 w-36 object-cover rounded-md"
                      />
                      <h4 className="text-xs font-semibold my-1">
                        {selectedMarker.title}
                      </h4>
                      <p className="text-xs text-gray-700">
                        {selectedMarker.location}
                      </p>
                    </div>
                  </InfoWindow>
                )}
            </Marker>
          ))}
        </GoogleMap>
      </div>
      <div className="locations-list mt-4">
        {/* <h3>Locations</h3> */}
        <ul className="flex flex-wrap space-x-2 items-center">
          {validCoordinates.map((item, index) => (
            <li
              key={index}
              onClick={() =>
                handleMarkerClick(
                  item.lat,
                  item.lng,
                  item.title,
                  item.location,
                  item.id
                )
              }
              style={{
                cursor: "pointer",
                marginBottom: "10px",
                padding: "10px",
                borderWidth: '1px',
                borderRadius: "5px",
                borderColor:selectedMarker && item.title === selectedMarker.title
                ? "#fff"
                : "#e0e0e0" ,
                background:
                  selectedMarker && item.title === selectedMarker.title
                    ? "#efefef"
                    : "#fff",
              }}
            >
              <span className="flex items-center justify-between space-x-2">
                <p className="text-base  font-semibold capitalize text-tn_dark">{item.title}</p>
                <p className="text-sm text-tn_text_grey">
                  Ratings:{" "}
                  {item.rating && !isNaN(Number(item.rating))
                    ? Number(item.rating).toFixed(2)
                    : "N/A"}
                </p>
              </span>
              <span className="flex items-center justify-between">
                <p className="capitalize text-sm text-tn_text_grey">{item.location}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the marker click event
                    navigate(`/restaurant/${item.id}`); // Navigate to card details
                  }}
                  className="text-tn_pink text-sm"
                >
                  View
                </button>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default React.memo(MapComponent);
