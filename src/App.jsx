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
import UserProfile from "./pages/UserProfile";
import Booking from "./pages/Booking";
import LandlordPage from "./pages/Landlord";
import LandlordDashboard from "./pages/LandlordDashboard";
import FormData from "./components/FormData";
import PropertyListings from "./pages/PropertyListings";
import MyProperties from "./components/MyProperties";
import UserRequests from "./components/UserRequests";
import OfficeMap from "./components/OfficeMap";
import DashboardAdmin from "./components/DashboardAdmin";
import RequestsAdmin from "./components/RequestsAdmin";
import UsersAdmin from "./components/UsersAdmin";

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

function Layout() {
  const location = useLocation();
  const hideNavbarRoutes = [
    "/login",
    "/signup",
    "/landlordDashboard",
    "/usersadmin",
    "/RequestsAdmin",
    "/dashboardadmin",
    "/my",
    "/formData",
    "/request"
  ];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/offices" element={<PropertyListings />} />
        <Route path="/properties/:propertyId" element={<PropertiesDetails />} />
        <Route path="/map" element={<OfficeMap />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/payment/:id" element={<Payment />} />{" "}
        {/* Updated route */}
        <Route path="/be-a-landlord" element={<LandlordPage />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/landlordDashboard" element={<LandlordDashboard />} />
        <Route path="/formData" element={<FormData />} />
        <Route path="/booking/:propertyId" element={<Booking />} />
        <Route path="/UserProfile" element={<UserProfile />} />
        <Route path="/dashboardadmin" element={<DashboardAdmin />} />
        <Route path="/RequestsAdmin" element={<RequestsAdmin />} />
        <Route path="/usersadmin" element={<UsersAdmin />} />
        <Route path="/request" element={<UserRequests />} />
        <Route path="/my" element={<MyProperties />} />
        <Route path="/my" element={<MyProperties />} />

      </Routes>
    </>
  );
}

export default App;
