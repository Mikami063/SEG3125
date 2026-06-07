// backgroud image added via codex
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./Home";
import ServiceSitePage from "./pages/ServiceSite/ServiceSitePage";
import "./App.css";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/service" element={<ServiceSitePage />} />
        <Route path="/game" element={<ServiceSitePage />} />
        <Route path="/ecommerce" element={<ServiceSitePage />} />
        <Route path="/analytics" element={<ServiceSitePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
