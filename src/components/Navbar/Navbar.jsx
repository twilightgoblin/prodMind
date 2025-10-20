import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

// 📝 each navItem points to an id on the page or route
const navItems = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "About Us", href: "#aboutus" },
  { name: "Dashboard", href: "/dashboard", isRoute: true },
  { name: "Contact", href: "#footer" },
];

export default function Header2() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activeId, setActiveId] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      // highlight active section
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
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      window.location.href = href;
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
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
                      activeId === item.href.slice(1) || (item.isRoute && window.location.pathname === item.href)
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
              <a
                href="#login"
                onClick={(e) => handleNavClick(e, "#login")}
                className="text-white hover:text-gray-300 px-4 py-2 text-sm font-medium transition-colors duration-200"
              >
                Sign In
              </a>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a
                  href="#signup"
                  onClick={(e) => handleNavClick(e, "#signup")}
                  className="bg-white text-black hover:bg-gray-100 inline-flex items-center space-x-2 rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm transition-all duration-200"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </motion.div>
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
                  <a
                    href="#login"
                    onClick={(e) => handleNavClick(e, "#login")}
                    className="text-white hover:bg-white/10 block w-full rounded-lg py-3 text-center font-medium transition-colors duration-200"
                  >
                    Sign In
                  </a>
                  <a
                    href="#signup"
                    onClick={(e) => handleNavClick(e, "#signup")}
                    className="bg-white text-black hover:bg-gray-100 block w-full rounded-lg py-3 text-center font-medium transition-all duration-200"
                  >
                    Get Started
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
