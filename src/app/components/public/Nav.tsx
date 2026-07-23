import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { Film, ArrowRight, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Work", path: "/work" },
  { label: "Services", path: "/services" },
  { label: "About", path: "/about" },
  { label: "Careers", path: "/careers" },
  { label: "Contact", path: "/contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close mobile menu on path changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === "/" || location.pathname === "/home";

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
        style={{
          background: scrolled ? "rgba(255,255,255,0.94)" : "transparent",
          backdropFilter: scrolled ? "saturate(180%) blur(24px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.055)" : "none",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-14 flex items-center justify-between h-[68px] lg:h-[76px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Cre8tiveCove Logo"
              className="h-9 lg:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map(({ label, path }) => (
              <NavLink
                key={label}
                to={path}
                className="px-4 py-2 rounded-lg text-sm transition-all duration-200 relative"
                style={({ isActive }) => ({
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#8F6E2F" : "#444",
                  background: isActive ? "rgba(200,169,107,0.08)" : "transparent",
                })}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => navigate("/contact")}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-px cursor-pointer"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#111", color: "#fff" }}
            >
              Start a Project
              <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 -mr-2 cursor-pointer">
            {menuOpen ? <X size={20} color="#111" /> : <Menu size={20} color="#111" />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className="fixed inset-0 z-40 lg:hidden transition-all duration-400"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "all" : "none",
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(20px)",
          paddingTop: 80,
        }}
      >
        <nav className="flex flex-col px-8 gap-1">
          {NAV_ITEMS.map(({ label, path }) => (
            <NavLink
              key={label}
              to={path}
              className="text-left py-4 text-2xl font-semibold border-b border-gray-100 transition-colors"
              style={({ isActive }) => ({
                fontFamily: "'Playfair Display', serif",
                color: isActive ? "#8F6E2F" : "#111",
                fontStyle: isActive ? "italic" : "normal",
              })}
            >
              {label}
            </NavLink>
          ))}
          <button
            onClick={() => navigate("/contact")}
            className="mt-6 py-4 rounded-2xl text-base font-semibold text-center cursor-pointer"
            style={{ background: "#111", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Start a Project
          </button>
        </nav>
      </div>
    </>
  );
}
