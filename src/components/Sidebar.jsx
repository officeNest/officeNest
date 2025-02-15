import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaEnvelope,
  FaUserShield,
  FaUsers,
} from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboardadmin" },
  { name: "Requests", icon: <FaEnvelope />, path: "/RequestsAdmin" },
  { name: "Users", icon: <FaUsers />, path: "/usersadmin" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const currentIndex = menuItems.findIndex(
      (item) => item.path === location.pathname
    );
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [location]);

  return (
    <div className="bg-[#0C2BA1] w-64 min-h-screen flex flex-col shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 px-2">
          <FaUserShield className="text-white text-2xl" />
          <span className="font-bold text-white text-lg tracking-wide">
            Super Admin
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => {
                  setActiveIndex(index);
                  navigate(item.path);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${
                    activeIndex === index
                      ? "bg-white text-[#0C2BA1] shadow-lg font-medium"
                      : "text-white/90 hover:bg-white/10"
                  }
                `}
              >
                <span
                  className={`text-lg ${
                    activeIndex === index ? "text-[#0C2BA1]" : "text-white/90"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-6 mt-auto border-t border-white/10">
        <div className="flex items-center justify-center">
          <span className="text-white/60 text-sm">Super Admin</span>
        </div>
      </div>
    </div>
  );
}
