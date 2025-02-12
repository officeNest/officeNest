import { useState } from "react";

import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";

import SignUp from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";


function App() {
  return (
    <>
     
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />

        </Routes>
      

    </>
  );
}

export default App;
