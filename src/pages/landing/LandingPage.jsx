import { useState, useEffect } from "react";

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900 tracking-tight">
                PaisaBuddy
              </span>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 rounded-lg hover:bg-gray-100">
                Login
              </button>
              <button className="px-5 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white text-sm font-medium rounded-full hover:from-teal-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Sign Up
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main>
        <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-green-200/30 rounded-full blur-3xl"></div>
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full mb-8">
                <span className="text-sm font-medium text-gray-700">
                  🎯 Your Personal Finance Journey Starts Here
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Master Your Money with
                <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  {" "}
                  PaisaBuddy
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Transform your financial future with personalized learning,
                smart budgeting tools, and expert guidance. Start building
                wealth today.
              </p>

              {/* CTA Button */}
              <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white text-lg font-semibold rounded-full hover:from-teal-600 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 group">
                Get Started Free
                <svg
                  className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>

              {/* Trust Indicators */}
              <div className="mt-12 flex items-center justify-center space-x-8 text-gray-500">
                <span className="text-sm">🔒 Bank-level Security</span>
                <span className="text-sm">📱 Mobile First</span>
                <span className="text-sm">⭐ 4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to
                <span className="text-teal-600"> Succeed Financially</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Comprehensive tools and personalized guidance to help you
                achieve your financial goals
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {/* Feature 1 */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-green-50 to-teal-50 border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Interactive Learning
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Master personal finance through engaging courses, quizzes, and
                  real-world scenarios. Learn at your own pace with
                  expert-crafted content.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Smart Budgeting
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  AI-powered budget tracking that adapts to your lifestyle. Get
                  personalized insights and recommendations to optimize your
                  spending habits.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Goal Achievement
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Set and track financial goals with milestone celebrations.
                  From emergency funds to dream purchases, we help you stay
                  motivated and on track.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Logo */}
            <div className="flex items-center mb-6 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="ml-2 text-lg font-semibold">PaisaBuddy</span>
            </div>

            {/* Links */}
            <div className="flex items-center space-x-8 text-sm text-gray-300">
              <a
                href="#about"
                className="hover:text-white transition-colors duration-200"
              >
                About
              </a>
              <a
                href="#contact"
                className="hover:text-white transition-colors duration-200"
              >
                Contact
              </a>
              <a
                href="#terms"
                className="hover:text-white transition-colors duration-200"
              >
                Terms
              </a>
              <a
                href="#privacy"
                className="hover:text-white transition-colors duration-200"
              >
                Privacy
              </a>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>
              &copy; 2025 PaisaBuddy. All rights reserved. Built with ❤️ for
              your financial success.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
