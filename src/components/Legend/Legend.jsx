import React from "react";
import { Stack } from "@mui/material";

export default function Legend({ getColor }) {
  const grades = [0, 20, 40, 60, 80, 100];
  const style = {
    stack: {
      padding: "10px",
      maxWidth: "fit-content",
      boxShadow: "0 0 15px 1px rgba(0, 0, 0, 0.4)",
      position: "absolute",
      top: "20px",
      right: "20px",
      zIndex: "1",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
    },
    legend: {
      lineHeight: "18px",
      color: "#555",
    },
    i: {
      width: "18px",
      height: "18px",
      float: "left",
      marginRight: "8px",
      opacity: "0.7",
    },
    div: {
      display: "flex",
      alignItems: "center",
    },
  };
  return (
    <Stack style={style.stack}>
      {grades.map((grade, index) => {
        return (
          <div style={style.div}>
            <i style={{ ...style.i, background: getColor(grade + 1) }}></i>
            <span style={style.legend}>{`${grade} ${
              grades[index + 1] ? "- " + grades[index + 1] : "+"
            }`}</span>
          </div>
        );
      })}
    </Stack>
  );
}
