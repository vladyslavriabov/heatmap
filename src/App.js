import "./App.css";
import React, { useState, useEffect } from "react";
import Map from "./components/Map/Map";
import Tooltip from "./components/Tooltip/Tooltip";
import { Grid, ToggleButtonGroup, ToggleButton } from "@mui/material";
import Legend from "./components/Legend/Legend";

function getColor(d) {
  return d > 100
    ? "#005824"
    : d > 80
    ? "#238b45"
    : d > 60
    ? "#41ae76"
    : d > 40
    ? "#66c2a4"
    : d > 20
    ? "#99d8c9"
    : "#ccece6";
}
function App() {
  const [data, setData] = useState({
    level1: {
      geojsonUrl: "https://sc-test-data-uk.netlify.app/great_britain_1.geojson",
      valuesUrl:
        "https://sc-test-data-uk.netlify.app/data_great_britain_1.json",
    },
    level2: {
      geojsonUrl: "https://sc-test-data-uk.netlify.app/great_britain_2.geojson",
      valuesUrl:
        "https://sc-test-data-uk.netlify.app/data_great_britain_2.json",
    },
  });
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [level, setLevel] = useState("level1");
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (!selectedFeatureId) {
      setSelectedFeature(null);
      return;
    }
    const feature = data[level].data.find(
      (item) => item.id === selectedFeatureId
    );
    setSelectedFeature(feature);
  }, [selectedFeatureId]);
  const handleLevelChange = (event, newLevel) => {
    if (!newLevel) return;
    setSelectedFeatureId(null);
    setLevel(newLevel);
  };
  const handleButtonClick = (event, featureId) => {
    if (!featureId) return;
    setSelectedFeatureId(featureId);
  };
  const fetchData = async () => {
    try {
      const requests = Object.values(data).map((lvl) =>
        Promise.all([
          fetch(lvl.geojsonUrl).then((response) => response.json()),
          fetch(lvl.valuesUrl).then((response) => response.json()),
        ])
      );
      const responses = await Promise.all(requests);
      const updatedData = Object.keys(data).reduce((result, level, index) => {
        const levelName = `lvl${level.match(/\d+/)[0]}_name`;
        const geoData = responses[index][0];
        const geoValues = responses[index][1];
        const CombineData = geoData.features.map((feature) => {
          const item = geoValues.features.find((i) => {
            return i.properties[levelName] === feature.properties[levelName];
          });
          return {
            ...feature,
            name: item.properties[levelName],
            density: item.properties["Density"],
          };
        });
        result[level] = {
          data: CombineData,
        };
        return result;
      }, {});
      setData(updatedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const ButtonStyle = {
    height: "50px",
    width: "200px",
  };
  return (
    <>
      {!data[level].data ? (
        <div>
          <b>Loading ...</b>
        </div>
      ) : (
        <div className="App">
          <Grid
            container
            direction="row"
            sx={{ height: "100%", width: "100%" }}
          >
            <Grid
              container
              item
              direction="column"
              justifyContent="center"
              alignItems="stretch"
              xs={4}
            >
              <Grid
                item
                xs={3}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <h2>Level of Administrative Divisions</h2>
                <ToggleButtonGroup
                  color="primary"
                  orientation="vertical"
                  value={level}
                  exclusive
                  onChange={handleLevelChange}
                >
                  <ToggleButton value="level1" style={ButtonStyle}>
                    Level 1
                  </ToggleButton>
                  <ToggleButton value="level2" style={ButtonStyle}>
                    Level 2
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={9}>
                <h2>Administrative Divisions</h2>
                <ToggleButtonGroup
                  color="primary"
                  orientation="vertical"
                  value={selectedFeatureId}
                  exclusive
                  onChange={handleButtonClick}
                  style={{ maxHeight: "500px", overflow: "auto" }}
                >
                  {data[level].data.map((feature) => (
                    <ToggleButton
                      key={feature.id}
                      value={feature.id}
                      style={ButtonStyle}
                    >
                      {feature.name}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Grid>
            </Grid>
            <Grid item xs={8} style={{ position: "relative" }}>
              {selectedFeature && <Tooltip data={selectedFeature} />}
              <Map
                geoData={data[level].data}
                selectedFeature={selectedFeature}
                setSelectedFeatureId={setSelectedFeatureId}
                level={level}
                setLevel={setLevel}
                getColor={getColor}
              />
              <Legend getColor={getColor} />
            </Grid>
          </Grid>
        </div>
      )}
    </>
  );
}

export default App;
