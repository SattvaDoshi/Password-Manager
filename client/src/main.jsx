import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

window.addEventListener('beforeinstallprompt', (e) => {
	e.preventDefault(); // Prevent the default mini-infobar
	window.deferredPrompt = e; // Store the event for later use
  });

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);
