import React, { useEffect } from "react";
import style from "./Map.module.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
export default function Map({
  geoData,
  level,
  setLevel,
  selectedFeatureId,
  setSelectedFeatureId,
}) {
  const maxZoom = level === "level1" ? 7 : null;
  const minZoom = level === "level2" ? 8 : 1;
  const ZoomLevelIndicator = () => {
    const map = useMap();
    map.on("zoomend", () => {
      const newLevel = map.getZoom() >= 8 ? "level2" : "level1";
      console.log(newLevel, level);
      if (newLevel !== level) {
        setLevel((prev) => {
          if (prev === level && level !== newLevel) {
            setSelectedFeatureId(null);
          }
          return newLevel;
        });
        console.log("fired");
      }
    });

    useEffect(() => {
      if (selectedFeatureId) {
        const { bbox } = geoData.find((item) => item.id === selectedFeatureId);
        const bounds = [
          [bbox[3], bbox[2]],
          [bbox[1], bbox[0]],
        ];
        map.fitBounds(bounds, { maxZoom: maxZoom, minZoom: minZoom });
      }
    }, [selectedFeatureId]);

    return null;
  };

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
  const handleClick = (event) => {
    const layer = event.target;
    setSelectedFeatureId(layer.feature.id);
    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      const map = layer._map; // Access the underlying Leaflet map instance
      map.fitBounds(bounds, { maxZoom: maxZoom, minZoom: minZoom });
    }
  };
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>hello</h3>");
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          fillOpacity: 0.1,
        });
      },
      mouseout: (e) => {
        e.target.setStyle({
          // dashArray: "3",
          fillOpacity: 0.7,
        });
      },
      click: (e) => handleClick(e),
    });
  }

  return (
    <>
      {geoData && (
        <MapContainer
          className={style.containter}
          zoom={6}
          minZoom={1}
          center={[53.89875435070986, -3.8841696195669964]}
        >
          <TileLayer
            url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=frNs8WslLB1c3AGHZzA8"
            attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
          />
          <GeoJSON
            key={level}
            data={geoData}
            style={(location) => {
              let fillColor =
                selectedFeatureId === location.id
                  ? "red"
                  : getColor(location.density);
              let result = {
                fillColor: fillColor,
                weight: 2,
                opacity: 1,
                color: "white",
                fillOpacity: 0.7,
              };
              return result;
            }}
            onEachFeature={onEachFeature}
          />
          <ZoomLevelIndicator />
        </MapContainer>
      )}
    </>
  );
}
