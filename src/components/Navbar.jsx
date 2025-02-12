import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation(); // Get current route

    // Function to determine active link styles
    const getLinkClass = (path) => {
        return location.pathname === path
            ? "text-[#0C2BA1] font-semibold" // Active link color
            : "text-gray-900 hover:text-[#0C2BA1]"; // Default color
    };

    return (
        <nav className="bg-white border-gray-200 drop-shadow-md dark:bg-gray-900 z-index-10">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src={logo} className="h-15 ml-[-30px]" alt="Flexora Logo" />
                    <span className="self-center text-2xl ml-[-10px] font-semibold whitespace-nowrap dark:text-white">Flexora</span>
                </Link>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    <button
                        onClick={() => navigate('/signup')}
                        type="button"
                        className="text-white bg-[#0C2BA1] hover:bg-[#CCCCCC] hover:text-black cursor-pointer focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
                    >
                        Sign Up
                    </button>
                </div>
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
                        <li>
                            <Link to="/" className={`block py-2 px-3 rounded-sm md:p-0 ${getLinkClass("/")}`}>Home</Link>
                        </li>
                        <li>
                            <Link to="/offices" className={`block py-2 px-3 rounded-sm md:p-0 ${getLinkClass("/offices")}`}>Explore Offices</Link>
                        </li>
                        <li>
                            <Link to="/about" className={`block py-2 px-3 rounded-sm md:p-0 ${getLinkClass("/about")}`}>About Us</Link>
                        </li>
                        <li>
                            <Link to="/contact" className={`block py-2 px-3 rounded-sm md:p-0 ${getLinkClass("/contact")}`}>Contact Us</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;