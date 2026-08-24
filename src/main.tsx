import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
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

/*
  Marks that JS is running, before the first render. The CSS uses it to gate
  every state that starts hidden and needs JS to reveal it — the loader, the
  hero deal, the case-study section entrances. Without it, the prerendered
  HTML would render blank for anyone whose JS has not arrived.
*/
document.documentElement.classList.add("js");

const container = document.getElementById("root")!;

const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

/*
  The build prerenders every route, so in production #root already holds the
  full markup and must be hydrated — calling createRoot().render() on it
  throws that markup away and rebuilds from scratch, which wastes the
  prerender and flashes. `npm run dev` serves an empty shell, hence the
  branch rather than hydrateRoot unconditionally.
*/
if (container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
