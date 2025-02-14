import { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaEnvelope,
  FaHeart,
  FaUserShield,
} from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", icon: <FaTachometerAlt /> },
  { name: "requests", icon: <FaEnvelope /> },
  { name: "Favorite", icon: <FaHeart /> },
];

export default function Sidebar() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [selectorStyle, setSelectorStyle] = useState({});

  useEffect(() => {
    updateSelector(activeIndex);
  }, [activeIndex]);

  const updateSelector = (index) => {
    const element = document.getElementById(`menu-item-${index}`);
    if (element) {
      setSelectorStyle({
        top: element.offsetTop + "px",
        height: element.offsetHeight + "px",
      });
    }
  };

  return (
    <div className="bg-[#0C2BA1] w-64 h-screen p-4 relative">
      {/* Super Admin Header */}
      <div className="flex items-center gap-2 text-white mb-6">
        <FaUserShield />
        <span className="font-bold">Super Admin</span>
      </div>

      <div
        className="absolute bg-white transition-all duration-500 ease-in-out"
        style={{ ...selectorStyle }}
      ></div>

      <ul className="relative">
        {menuItems.map((item, index) => (
          <li
            key={index}
            id={`menu-item-${index}`}
            className={`relative z-10 px-5 py-3 cursor-pointer transition-all duration-500 mb-4 ${
              activeIndex === index
                ? "text-white font-bold bg-white/20 rounded-md"
                : "text-white"
            }`}
            onClick={() => setActiveIndex(index)}
          >
            <span className="flex items-center gap-2">
              {item.icon}
              {item.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
