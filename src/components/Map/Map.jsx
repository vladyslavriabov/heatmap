import React from "react";
import style from "./Map.module.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
export default function Map() {
  return (
    <MapContainer
      className={style.containter}
      zoom={6}
      center={[53.89875435070986, -3.8841696195669964]}
    >
      <TileLayer
        url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=frNs8WslLB1c3AGHZzA8"
        attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
      />
    </MapContainer>
  );
}
