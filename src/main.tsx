import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "@fontsource/gloock/latin-400.css";
import "@fontsource/hanken-grotesk/latin-400.css";
import "@fontsource/hanken-grotesk/latin-400-italic.css";
import "@fontsource/hanken-grotesk/latin-500.css";
import "@fontsource/martian-mono/latin-400.css";
import "@fontsource/martian-mono/latin-600.css";
import "@fontsource/martian-mono/latin-700.css";
import "@fontsource/courier-prime/latin-400.css";
import "@fontsource/courier-prime/latin-700.css";
import "./styles/global.css";

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// Set before render: CSS hides animatable strokes only when JS is present, so prerendered HTML never shows blank.
document.documentElement.classList.add("js");

const container = document.getElementById("root")!;

const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Production HTML is prerendered and must be hydrated; the dev server serves an empty shell.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
