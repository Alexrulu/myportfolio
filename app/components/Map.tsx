'use client'
import { MapContainer, TileLayer, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function Map() {
  return (
    <>
      <style>{`
        .leaflet-bar a:first-child,
        .leaflet-bar a:last-child,
        .leaflet-bar a {
          border-radius: 0 !important;
        }
        .leaflet-bar {
          border-radius: 0 !important;
        }
      `}</style>
      <MapContainer
        center={[-34.5397, -58.7131]}
        zoom={13}
        scrollWheelZoom={false}
        zoomControl={true}
        className="w-full h-full"
        style={{ background: '#0e0e0e' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution=""
        />
        <Circle
          center={[-34.5397, -58.7131]}
          radius={600}
          pathOptions={{
            color: 'rgba(255,255,255,0.15)',
            fillColor: 'rgba(255,255,255,0.06)',
            fillOpacity: 1,
            weight: 1,
          }}
        />
      </MapContainer>
    </>
  )
}