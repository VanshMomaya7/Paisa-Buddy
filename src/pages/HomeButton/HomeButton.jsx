import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const HomeButton = ({ className = "" }) => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className={`relative inline-block top-8 ${className}`}>
      {/* Tooltip */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 -top-12 px-2 py-3 bg-gray-900 dark:bg-gray-700 text-white text-sm font-medium rounded-lg shadow-lg whitespace-nowrap transition-all duration-300 ease-in-out ${
          showTooltip
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        Go to Home
        {/* Tooltip Arrow */}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-700"></div>
      </div>

      {/* Home Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group relative w-14 h-12 bg-white dark:bg-gray-800 hover:bg-gradient-to-r hover:from-teal-500 hover:to-blue-600 dark:hover:from-teal-600 dark:hover:to-blue-700 text-gray-700 dark:text-gray-300 hover:text-white rounded-full shadow-lg hover:shadow-xl border-2 border-gray-200 dark:border-gray-700 hover:border-transparent flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-teal-500/50 dark:focus:ring-teal-400/50"
        aria-label="Go to Home"
      >
        <Home className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />

        {/* Pulse Effect on Hover */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 dark:from-teal-600 dark:to-blue-700 opacity-0 group-hover:opacity-20 animate-ping"></span>
      </button>
    </div>
  );
};

export default HomeButton;
