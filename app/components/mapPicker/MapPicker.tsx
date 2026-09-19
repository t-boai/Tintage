"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function FlyToController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    const currentCenter = map.getCenter();
    const distance = currentCenter.distanceTo(center);
    if (distance > 50) {
      map.flyTo(center, 16, { animate: true, duration: 1 });
    }
  }, [center, map]);
  return null;
}

function MapEvents({
  onLocationChange,
}: {
  onLocationChange: (lat: number, lng: number) => void;
}) {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      onLocationChange(center.lat, center.lng);
    },
  });
  return null;
}

interface MapPickerProps {
  position: [number, number];
  setPosition: (lat: number, lng: number) => void;
}

export default function MapPicker({ position, setPosition }: MapPickerProps) {
  return (
    <div className="relative z-0 h-full w-full">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 10 }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyToController center={position} />
        <MapEvents onLocationChange={(lat, lng) => setPosition(lat, lng)} />

        <div className="pointer-events-none absolute top-1/2 left-1/2 z-1000 flex -translate-x-1/2 -translate-y-full flex-col items-center">
          <div className="mb-1 animate-bounce rounded-md bg-red-500 px-2 py-1 text-[10px] font-bold text-white shadow-lg">
            Giao đến đây
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-red-500 shadow-xl">
            <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
          </div>
        </div>
      </MapContainer>
    </div>
  );
}
