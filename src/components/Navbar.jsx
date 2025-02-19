import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/authSlice";
import { UserCircle, ChevronDown, Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `relative px-3 py-2 transition-colors duration-200 ${
      isActive
        ? "text-[#0C2BA1] font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0C2BA1] after:transform after:scale-x-100 after:transition-transform"
        : "text-gray-700 hover:text-[#0C2BA1] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0C2BA1] after:transform after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
    }`;
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-lg" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img
              src={logo}
              className="h-8 w-auto transform transition-transform duration-200 hover:scale-105"
              alt="Flexora Logo"
            />
            <span className="text-xl font-bold text-gray-900">Flexora</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={getLinkClass("/")}>
              Home
            </Link>
            <Link to="/offices" className={getLinkClass("/offices")}>
              Explore Offices
            </Link>
            <Link to="/about" className={getLinkClass("/about")}>
              About Us
            </Link>
            <Link to="/contact" className={getLinkClass("/contact")}>
              Contact Us
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full transition-colors duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0C2BA1] focus:ring-opacity-50"
                >
                  <UserCircle className="w-5 h-5 text-[#0C2BA1]" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu with Animation */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 transform opacity-100 scale-100 transition-all duration-200 origin-top-right">
                    <div className="py-1">
                      <Link
                        to="/userprofile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        Profile
                      </Link>
                      {user.role !== "owner" ? (
                      <Link
                        to="/be-a-landlord"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        Be a Landlord
                      </Link>
                      ):(
                        <Link
                        to="/my"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        Your DashBoard
                      </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-150"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/signup")}
                className="bg-[#0C2BA1] text-white px-6 py-2 rounded-lg text-sm font-medium transform transition-all duration-200 hover:bg-[#0C2BA1]/90 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#0C2BA1] focus:ring-opacity-50"
              >
                Sign Up
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#0C2BA1] hover:bg-gray-50"
              >
                Home
              </Link>
              <Link
                to="/offices"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#0C2BA1] hover:bg-gray-50"
              >
                Explore Offices
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#0C2BA1] hover:bg-gray-50"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#0C2BA1] hover:bg-gray-50"
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
