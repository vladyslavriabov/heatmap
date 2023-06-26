import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";

export default function Map({
  geoData,
  level,
  setLevel,
  selectedFeature,
  setSelectedFeatureId,
  getColor,
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
      if (selectedFeature) {
        const { bbox } = selectedFeature;
        const bounds = [
          [bbox[3], bbox[2]],
          [bbox[1], bbox[0]],
        ];
        map.fitBounds(bounds, { maxZoom: maxZoom, minZoom: minZoom });
      }
    }, [selectedFeature]);

    return null;
  };

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
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          fillOpacity: 1,
          color: "gray",
        });
      },
      mouseout: (e) => {
        e.target.setStyle({
          fillOpacity: 0.7,
          color: "white",
        });
      },
      click: (e) => handleClick(e),
    });
  }

  return (
    <>
      {geoData && (
        <MapContainer
          style={{
            width: "100%",
            height: "100%",
            zIndex: "0",
          }}
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
              console.log(location.density);
              let fillColor =
                selectedFeature?.id === location.id
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
