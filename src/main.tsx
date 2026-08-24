import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/global.css";

/*
  Both pages decide their own starting scroll — the home page opens on the
  hero and deals the name in, the case study opens on its title. Leaving
  restoration on "auto" lets the browser drop a reload back into whatever
  section was last on screen, which lands mid-narrative and skips the intro.
*/
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
