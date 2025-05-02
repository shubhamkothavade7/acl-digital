// src/theme.js
import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#4caf50" }, // green
    background: { default: "#f5f5f5", paper: "#ffffff" },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#81c784" }, // lighter green
    background: { default: "#121212", paper: "#1e1e1e" },
  },
});
