import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
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
import EditCard from "./components/EditCard";

// ProtectedRoute Component
const ProtectedRoute = ({ allowedRoles, children }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user's role is not allowed, redirect to home page
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // If user's role is allowed, render the children
  return children;
};

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
    "/request",
  ];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/offices" element={<PropertyListings />} />
        <Route path="/properties/:propertyId" element={<PropertiesDetails />} />
        <Route path="/map" element={<OfficeMap />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/edit/:id" element={<EditCard />} />
        <Route path="/be-a-landlord" element={<LandlordPage />} />
        <Route path="/booking/:propertyId" element={<Booking />} />
        <Route path="/UserProfile" element={<UserProfile />} />

        {/* Protected Routes */}
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/landlordDashboard"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <LandlordDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboardadmin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/RequestsAdmin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <RequestsAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usersadmin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UsersAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/request"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <UserRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/formdata"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <FormData />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <MyProperties />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
