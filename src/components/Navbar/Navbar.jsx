import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { Menu, X, ArrowRight, User, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

// 📝 each navItem points to an id on the page or route
const navItems = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "About Us", href: "#aboutus" },
  { name: "Contact", href: "#footer" },
];

export default function Header2() {
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activeId, setActiveId] = useState("home");
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      // Only highlight sections when on home page
      if (location.pathname === '/') {
        let current = "home";
        navItems.forEach((item) => {
          // Only check sections for hash links, not routes
          if (!item.isRoute && item.href.startsWith('#')) {
            const section = document.querySelector(item.href);
            if (section && window.scrollY >= section.offsetTop - 100) {
              current = section.id;
            }
          }
        });
        setActiveId(current);
      }
    };

    // Handle hash navigation when coming from other pages
    if (location.pathname === '/' && location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 } };

  const mobileMenuVariants = {
    closed: { opacity: 0, x: "100%", transition: { duration: 0.3, ease: easeInOut } },
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: easeInOut, staggerChildren: 0.1 },
    },
  };

  const mobileItemVariants = { closed: { opacity: 0, x: 20 }, open: { opacity: 1, x: 0 } };

  const handleNavClick = (e, href, isRoute = false) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    if (isRoute) {
      navigate(href);
    } else {
      // For hash links, check if we're on the home page
      if (location.pathname !== '/') {
        // Navigate to home page first, then scroll to section
        navigate('/' + href);
      } else {
        // Already on home page, just scroll
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleSignOut = () => {
    signOut();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <div>
      <motion.header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "border-border/30 bg-black/70 border-b shadow-sm backdrop-blur-md"
            : "bg-transparent"
        }`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* left slot */}
            <div className="flex items-center">{/* logo if needed */}</div>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center space-x-1 absolute left-1/2 -translate-x-[57%]">
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href, item.isRoute)}
                    className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      activeId === item.href.slice(1) || (item.isRoute && location.pathname === item.href)
                        ? "text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {hoveredItem === item.name && (
                      <motion.div
                        className="bg-white/10 absolute inset-0 rounded-lg"
                        layoutId="navbar-hover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.name}</span>
                  </a>
                </motion.div>
              ))}
            </nav>

            {/* Desktop buttons (right side) */}
            <motion.div className="hidden lg:flex items-center space-x-3" variants={itemVariants}>
              {isAuthenticated ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-white hover:text-gray-300 px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-white/10"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center border border-gray-600">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span>{user?.firstName || 'User'}</span>
                  </motion.button>
                  
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2"
                      >
                        <button
                          onClick={() => {
                            navigate('/dashboard');
                            setShowUserMenu(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={() => {
                            navigate('/dashboard/analytics');
                            setShowUserMenu(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                        >
                          User Analytics
                        </button>
                        <button
                          onClick={() => {
                            navigate('/dashboard/content');
                            setShowUserMenu(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                        >
                          Content Intelligence
                        </button>
                        <button
                          onClick={() => {
                            navigate('/smart-scheduler');
                            setShowUserMenu(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                        >
                          Smart Scheduler
                        </button>
                        <button
                          onClick={() => {
                            navigate('/summarizer');
                            setShowUserMenu(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                        >
                          Summarizer
                        </button>
                        <button
                          onClick={() => {
                            navigate('/notes');
                            setShowUserMenu(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                        >
                          Notes
                        </button>
                        <div className="border-t border-gray-600 my-2"></div>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/signin')}
                    className="text-white hover:text-gray-300 px-4 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    Sign In
                  </button>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <button
                      onClick={() => navigate('/signup')}
                      className="bg-white hover:bg-gray-100 text-black inline-flex items-center space-x-2 rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm transition-all duration-200"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                </>
              )}
            </motion.div>

            {/* Mobile hamburger */}
            <motion.button
              className="text-white hover:bg-white/10 rounded-lg p-2 transition-colors duration-200 lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variants={itemVariants}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="border-border bg-[#000000] fixed top-16 right-4 z-50 w-80 overflow-hidden rounded-2xl border shadow-2xl lg:hidden"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
            >
              <div className="space-y-6 p-6">
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <motion.div key={item.name} variants={mobileItemVariants}>
                      <a
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href, item.isRoute)}
                        className="text-white hover:bg-white/10 block rounded-lg px-4 py-3 font-medium transition-colors duration-200"
                      >
                        {item.name}
                      </a>
                    </motion.div>
                  ))}
                </div>
                <motion.div className="border-border space-y-3 border-t pt-6" variants={mobileItemVariants}>
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center space-x-3 px-4 py-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center border border-gray-600">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-white font-medium">{user?.firstName || 'User'}</span>
                      </div>
                      <button
                        onClick={() => {
                          navigate('/dashboard');
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-white hover:bg-white/10 block w-full rounded-lg py-3 text-center font-medium transition-colors duration-200"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => {
                          navigate('/dashboard/analytics');
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-white hover:bg-white/10 block w-full rounded-lg py-3 text-center font-medium transition-colors duration-200"
                      >
                        User Analytics
                      </button>
                      <button
                        onClick={() => {
                          navigate('/dashboard/content');
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-white hover:bg-white/10 block w-full rounded-lg py-3 text-center font-medium transition-colors duration-200"
                      >
                        Content Intelligence
                      </button>
                      <button
                        onClick={() => {
                          navigate('/smart-scheduler');
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-white hover:bg-white/10 block w-full rounded-lg py-3 text-center font-medium transition-colors duration-200"
                      >
                        Smart Scheduler
                      </button>
                      <button
                        onClick={() => {
                          navigate('/summarizer');
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-white hover:bg-white/10 block w-full rounded-lg py-3 text-center font-medium transition-colors duration-200"
                      >
                        Summarizer
                      </button>
                      <button
                        onClick={() => {
                          navigate('/notes');
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-white hover:bg-white/10 block w-full rounded-lg py-3 text-center font-medium transition-colors duration-200"
                      >
                        Notes
                      </button>
                      <div className="border-t border-gray-600 my-3"></div>
                      <button
                        onClick={handleSignOut}
                        className="text-white hover:bg-white/10 block w-full rounded-lg py-3 text-center font-medium transition-colors duration-200"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          navigate('/signin');
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-white hover:bg-white/10 block w-full rounded-lg py-3 text-center font-medium transition-colors duration-200"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          navigate('/signup');
                          setIsMobileMenuOpen(false);
                        }}
                        className="bg-white hover:bg-gray-100 text-black block w-full rounded-lg py-3 text-center font-medium transition-all duration-200"
                      >
                        Get Started
                      </button>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
