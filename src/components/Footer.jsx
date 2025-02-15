import React from 'react'
import { Link } from 'react-router-dom'
import logo from "../assets/logo2.png"
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { IoLocationOutline, IoMailOutline, IoCallOutline } from "react-icons/io5";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div>
            <h2 className="text-white text-2xl font-semibold flex items-center">
            <img src={logo} className="h-10" alt="Flowbite Logo" /> Flexora
            </h2>
            <p className="text-sm mt-3">
             flexible office rental solution, making workspace access effortless and seamless.
            </p>
            <div className="flex space-x-3 mt-4">
              <a href="#" className="text-gray-400 hover:text-white"><FaFacebookF size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FaTwitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FaInstagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FaYoutube size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold border-b-2 border-blue-600 pb-1 inline-block">Quick Link</h3>
            <ul className="mt-3 space-y-2">
              <li><Link to="/" className="hover:text-white">› Home</Link></li>
              <li><Link to="/about" className="hover:text-white">› About Us</Link></li>
              <li><Link to="/offices" className="hover:text-white">› Offices</Link></li>
              <li><Link to="/contact" className="hover:text-white">› Contact Us</Link></li>
            </ul>
          </div>

          {/* Other Links */}
          <div>
            <h3 className="text-white text-lg font-semibold border-b-2 border-blue-600 pb-1 inline-block">Links</h3>
            <ul className="mt-3 space-y-2">
              <li><Link to="/map" className="hover:text-white">› Map</Link></li>
              <li><Link to="/offices" className="hover:text-white">› Book Now</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold border-b-2 border-blue-600 pb-1 inline-block">Contact</h3>
            <ul className="mt-3 space-y-3">
              <li className="flex items-center space-x-2">
                <IoLocationOutline className="text-blue-500" />
                <span>Jordan, Zarqa</span>
              </li>
              <li className="flex items-center space-x-2">
                <IoMailOutline className="text-blue-500" />
                <span>flexora@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <IoCallOutline className="text-blue-500" />
                <span>+962-788844145</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-700 text-center text-sm mt-6 pt-4">
          © 2025 All rights reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
