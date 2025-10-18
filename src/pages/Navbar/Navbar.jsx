import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="hidden md:flex items-center space-x-6">
      {/* <Link
                to="/learning"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
              >
                Learning
              </Link> */}
      <Link
        to="/quiz"
        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
      >
        Quiz
      </Link>
      <Link
        to="/simulator"
        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
      >
        Simulator
      </Link>
      <Link
        to="/credit"
        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
      >
        Credit
      </Link>
      <Link
        to="/budget"
        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
      >
        Budget
      </Link>
    </div>
  );
};

export default Navbar;
