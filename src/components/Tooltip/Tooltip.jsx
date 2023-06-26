import React from "react";
import { Stack } from "@mui/material";

export default function Tooltip({ data }) {
  const { name, density } = data;
  const styles = {
    stack: {
      padding: "20px",
      maxWidth: "fit-content",
      boxShadow: "0 0 15px 1px rgba(0, 0, 0, 0.4)",
      position: "absolute",
      bottom: "20px",
      left: "20px",
      zIndex: "1",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
    },
    name: {
      fontSize: "18px",
      fontWeight: "bold",
    },
  };
  return (
    <Stack style={styles.stack}>
      <span>Selected division:</span>
      <span style={styles.name}>{name}</span>
      <span>{`Density: ${density}`}</span>
    </Stack>
  );
}
