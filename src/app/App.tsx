import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { Nav } from "./components/public/Nav.js";
import { Footer } from "./components/public/Footer.js";

// Public Pages
import HomePage from "./pages/public/HomePage.js";
import AboutPage from "./pages/public/AboutPage.js";
import ServicesPage from "./pages/public/ServicesPage.js";
import ServiceDetailPage from "./pages/public/ServiceDetailPage.js";
import WorkPage from "./pages/public/WorkPage.js";
import WorkDetailPage from "./pages/public/WorkDetailPage.js";
import CareersPage from "./pages/public/CareersPage.js";
import JobDetailPage from "./pages/public/JobDetailPage.js";
import ContactPage from "./pages/public/ContactPage.js";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin.js";
import AdminDashboard from "./pages/admin/AdminDashboard.js";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff", overflowX: "hidden" }}>
      {!isAdminRoute && <Nav />}
      <main style={{ minHeight: "100vh" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:slug" element={<WorkDetailPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/careers/:id" element={<JobDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
