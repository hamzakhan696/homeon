import './App.css';
import ThankYouPage from './pages/thankYou';
import NotFound from './pages/notFound';
import HomePage from "./pages/homepage";
import 'font-awesome/css/font-awesome.min.css';
import 'line-awesome/dist/line-awesome/css/line-awesome.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ContactUs from "./pages/contactUs";
import Blog from "./pages/blog";
import Portfolio from "./pages/portfolio";
import ProjectDetail from "./pages/ProjectDetail";
import CurrentProject from "./pages/services/currentProject";
import Consultancy from "./pages/services/consultancy";
import ProjectSelling from "./pages/services/projectSelling";
import PropertyManagement from "./pages/services/propertyManagement";
import Transactions from "./pages/services/transaction";
import Turnkey from "./pages/services/turnkey";
import AdminLogin from "./pages/adminLogin";
import AdminDashboard from "./pages/adminDashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./pages/scrollTop";
function App() {
  return (
    <div className="App">
  <BrowserRouter>
  <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/" element={<LandingPage />} /> */}
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/currentProject" element={<CurrentProject />} />
            <Route path="/consultancy" element={<Consultancy />} />
            <Route path="/projectSelling" element={<ProjectSelling />} />
            <Route path="/propertyManagement" element={<PropertyManagement />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/turnkey" element={<Turnkey />} />
            <Route path="/thankYou" element={<ThankYouPage />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
