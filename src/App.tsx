import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CaseStudy from "./pages/CaseStudy";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/work/:slug" element={<CaseStudy />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
