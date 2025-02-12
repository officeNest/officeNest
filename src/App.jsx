import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";

import SignUp from "./pages/Signup";
import Navbar from "./components/Navbar";
import PropertiesDetails from "./pages/PropertiesDetails"
import AdminDashboard from "./pages/AdminDashboard";


function App() {
  return (
    <>

      <Router>
        <Navbar/>
    
     
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/offices" element={<PropertiesDetails />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>

         

    </>
  );
}

export default App;
