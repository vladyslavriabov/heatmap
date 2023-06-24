import React, { useEffect, useState } from "react";
import style from "./Map.module.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
export default function Map() {
  const [geoJson, setGeoJson] = useState(null);
  const [values, setValuses] = useState(null);
  const [levelName, setLevelName] = useState("lvl1_name");
  const fetchData = async (url, setValue) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Sorry something went wrong");
      }
      const data = await response.json();
      setValue(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData(
      "https://sc-test-data-uk.netlify.app/great_britain_1.geojson",
      setGeoJson
    );
    fetchData(
      "https://sc-test-data-uk.netlify.app/data_great_britain_1.json",
      setValuses
    );
  }, []);
  function getColor(d) {
    return d > 100
      ? "#FC4E2A"
      : d > 50
      ? "#FD8D3C"
      : d > 20
      ? "#FEB24C"
      : d > 10
      ? "#FED976"
      : "#FFEDA0";
  }
  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          // dashArray: "1",
          fillOpacity: 0.3,
        });
      },
      mouseout: (e) => {
        e.target.setStyle({
          // dashArray: "3",
          fillOpacity: 0.7,
        });
      },
    });
  }
  return (
    <>
      {geoJson && values && (
        <MapContainer
          className={style.containter}
          zoom={6}
          center={[53.89875435070986, -3.8841696195669964]}
        >
          <TileLayer
            url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=frNs8WslLB1c3AGHZzA8"
            attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
          />
          <GeoJSON
            data={geoJson}
            style={(location) => {
              let item = values.features.find((i) => {
                return (
                  i.properties[levelName] === location.properties[levelName]
                );
              });
              let color = getColor(item.properties["Density"]);
              let result = {
                fillColor: color,
                weight: 2,
                opacity: 1,
                color: "white",
                // dashArray: "8",
                fillOpacity: 0.7,
              };
              return result;
            }}
            onEachFeature={onEachFeature}
          />
        </MapContainer>
      )}
    </>
  );
}
