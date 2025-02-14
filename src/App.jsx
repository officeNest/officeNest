
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Navbar from "./components/Navbar";
import PropertiesDetails from "./pages/PropertiesDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Payment from "./pages/Payment";
import AdminDashboard from "./pages/AdminDashboard";
import LandlordPage from "./pages/Landlord";
import LandlordDashboard from "./pages/LandlordDashboard";
import FormData from "./components/FormData";
import PropertyListings from "./pages/PropertyListings";
import OfficeMap from "./components/OfficeMap";

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

function Layout() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup", "/landlordDashboard"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/offices" element={<PropertyListings />} />
        <Route path="/map/:id" element={<PropertiesDetails />} />
        <Route path="/map" element={<OfficeMap />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/be-a-landlord" element={<LandlordPage />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/PropertiesDetails" element={<PropertiesDetails />} />
        <Route path="/landlordDashboard" element={<LandlordDashboard />} />
        <Route path="/formData" element={<FormData />} />
        <Route path="/request" element={<Request />} />
      </Routes>
    </>
  );
}

export default App;