import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const containernomeComponente = document.getElementById("root-nomeComponente");

const rootnomeComponente = ReactDOM.createRoot(containernomeComponente);
rootnomeComponente.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
