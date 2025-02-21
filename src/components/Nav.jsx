import { Link } from "react-router-dom";
import { Search, MessageSquare, Home, Building, PlusSquare } from "lucide-react";

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-[#0C2BA1]">Flexora</h1>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:block flex-1 max-w-xl mx-8">
            <div className="relative">
              
             
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link 
              to="/"
              className="hidden sm:flex items-center px-3 py-2 text-gray-600 hover:text-[#0C2BA1] transition-colors duration-200"
            >
              <Home className="h-5 w-5" />
              <span className="ml-2">Home</span>
            </Link>

            <Link 
              to="/my"
              className="hidden sm:flex items-center px-3 py-2 text-gray-600 hover:text-[#0C2BA1] transition-colors duration-200"
            >
              <Building className="h-5 w-5" />
              <span className="ml-2">Properties</span>
            </Link>

            <Link to="/request">
              <button className="flex items-center px-4 py-2 text-[#0C2BA1] bg-blue-50 rounded-lg
                               hover:bg-blue-100 transition-colors duration-200">
                <MessageSquare className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Request</span>
              </button>
            </Link>

            <Link to="/formData">
              <button className="flex items-center px-4 py-2 text-white bg-[#0C2BA1] rounded-lg
                               hover:bg-[#0A2280] transition-colors duration-200">
                <PlusSquare className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Add Property</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;