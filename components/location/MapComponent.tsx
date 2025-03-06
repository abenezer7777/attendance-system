"use client";

import { MapContainer, TileLayer, Circle } from "react-leaflet";
import { LatLngExpression } from "leaflet";
// import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  latitude: string;
  longitude: string;
  radius: number;
}

export default function MapComponent({
  latitude,
  longitude,
  radius,
}: MapComponentProps) {
  // Convert latitude and longitude to numbers and cast as LatLngExpression.
  const center: LatLngExpression = [
    parseFloat(latitude),
    parseFloat(longitude),
  ];

  return (
    <>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          {...{
            attribution:
              '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
          }}
        />
        <Circle
          center={center}
          radius={radius}
          pathOptions={{ color: "green" }}
        />
      </MapContainer>
    </>
  );
}
