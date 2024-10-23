import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { fallback, marker, markerSec } from "../assets";

const API_KEY = import.meta.env.VITE_GOOGLE_MAP_KEY;

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "10px",
};

const defaultCoordinates = { lat: 24.8607, lng: 67.0011 }; // Default coordinates (e.g., Karachi)

// Utility function to calculate distance using Haversine formula
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
};

const MapComponent = ({ data, requestUserLocation }) => {
  const navigate = useNavigate();
  const [center, setCenter] = useState(defaultCoordinates);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null); // User's location
  const [showNearby, setShowNearby] = useState(false); // Whether to show nearby places
  const [zoom, setZoom] = useState(13); // Map zoom level

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
  });

  if (!data || data.length === 0) {
    return <div className="text-start text-gray-500 mt-5">No data available to display</div>;
  }

  const validCoordinates = data
    .map((item) => ({
      lat: parseFloat(item.latitude),
      lng: parseFloat(item.longitude),
      title: item.title,
      location: item.location,
      id: item.id,
      images: item.images || fallback,
      rating: item.rating || "N/A",
    }))
    .filter((item) => !isNaN(item.lat) && !isNaN(item.lng));

  const nearbyRestaurants = userLocation
    ? validCoordinates.filter((item) => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          item.lat,
          item.lng
        );
        return distance <= 15; // Show restaurants within 5 kilometers
      })
    : [];

  // Only ask for user location if `requestUserLocation` is true
  useEffect(() => {
    if (requestUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userCoords);
          setCenter(userCoords); // Center map on user's location
          setZoom(13); // Zoom in to show nearby places
          setShowNearby(true); // Show nearby restaurants
        },
        () => {
          setCenter(defaultCoordinates); // Set to default if permission denied
          setZoom(12); // Keep default zoom
          setShowNearby(false); // Show all locations
        }
      );
    }
  }, [requestUserLocation]);

  // Update map bounds or zoom in on nearby locations if user location is available
  useEffect(() => {
    if (map) {
      const bounds = new window.google.maps.LatLngBounds();
      if (showNearby && userLocation) {
        nearbyRestaurants.forEach((coord) =>
          bounds.extend({ lat: coord.lat, lng: coord.lng })
        );
        map.fitBounds(bounds);
      } else {
        validCoordinates.forEach((coord) =>
          bounds.extend({ lat: coord.lat, lng: coord.lng })
        );
        map.fitBounds(bounds);
        setZoom(13); // Default zoom level
      }
    }
  }, [map, validCoordinates, userLocation, showNearby, nearbyRestaurants]);

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
          zoom={zoom}
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
              icon={{
                url: userLocation && nearbyRestaurants.some(
                  (nearby) =>
                    nearby.lat === item.lat && nearby.lng === item.lng
                )
                  ? markerSec // Highlight nearby with green marker
                  : marker, // Others with red
                scaledSize: new window.google.maps.Size(30, 30),
              }}
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
                borderColor:
                  selectedMarker && item.title === selectedMarker.title
                    ? "#fff"
                    : "#e0e0e0",
                background:
                  selectedMarker && item.title === selectedMarker.title
                    ? "#efefef"
                    : "#fff",
              }}
            >
              <span className="flex items-center justify-between space-x-2">
                <p className="text-base font-semibold capitalize text-tn_dark">
                  {item.title}
                </p>
                <p className="text-sm text-tn_text_grey">
                  Ratings:{" "}
                  {item.rating && !isNaN(Number(item.rating))
                    ? Number(item.rating).toFixed(2)
                    : "N/A"}
                </p>
              </span>
              <span className="flex items-center justify-between">
                <p className="capitalize text-sm text-tn_text_grey">
                  {item.location}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the marker click event
                    navigate(`/restaurant/${item.id}`);
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

export default MapComponent;
