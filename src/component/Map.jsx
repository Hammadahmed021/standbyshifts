import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix the default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ latitude, longitude }) => {
  // Default coordinates for Denmark
  const defaultCoordinates = [56.26392, 9.501785];

  // Convert latitude and longitude to numbers
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  // Check if lat and lng are valid numbers, otherwise use default coordinates
  const center = (!isNaN(lat) && !isNaN(lng)) ? [lat, lng] : defaultCoordinates;

  useEffect(() => {
    console.log('Latitude:', latitude);
    console.log('Longitude:', longitude);
    console.log('Center Coordinates:', center);
  }, [latitude, longitude, center]);

  return (
    <div className="h-64 w-full md:w-192 rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={13}
        style={{height: '250px', width: '100%'}} // Adjusted width to 100% for responsiveness
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={center}>
          <Popup>
            Latitude: {center[0]}, Longitude: {center[1]}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
