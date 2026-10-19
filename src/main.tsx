import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);

/* PWA: офлайн-режим и установка на Android как приложение */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/GRIDF-zeta/sw.js").catch(() => {
      /* офлайн-режим необязателен для работы */
    });
  });
}
