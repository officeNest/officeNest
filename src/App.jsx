
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
import PropertyListings from "./pages/PropertyListings";

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

function Layout() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/offices" element={<PropertyListings />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/be-a-landlord" element={<LandlordPage />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default App;
