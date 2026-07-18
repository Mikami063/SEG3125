// backgroud image added via codex
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./Home";
import ServiceSitePage from "./pages/ServiceSite/ServiceSitePage";
import ReservatePage from "./pages/ServiceSite/ReservatePage";
import ReferancePage from "./pages/ServiceSite/ReferancePage";
import AboutUs from "./pages/ServiceSite/AboutUs";
import GameSitePage from "./pages/GameSite/GameSitePage";
import ECommersitePage from "./pages/e-commersite/ECommersitePage";
import "./App.css";

const ElectricityDashboardPage = lazy(() => import("./pages/ElectricityDashboard/ElectricityDashboardPage"));


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/services" element={<ServiceSitePage />} />
        <Route path="/services/reservate" element={<ReservatePage />} />
        <Route path="/services/reference" element={<ReferancePage />} />
        <Route path="/services/about" element={<AboutUs />} />

        <Route path="/game" element={<GameSitePage />} />

        <Route path="/ecommerce" element={<ECommersitePage />} />

        <Route path="/analytics" element={<Suspense fallback={<div className="dashboard-loading" role="status">Loading electricity data…<br /><span>Chargement des données sur l’électricité…</span></div>}><ElectricityDashboardPage /></Suspense>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
