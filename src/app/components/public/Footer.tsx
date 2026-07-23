import { Link } from "react-router";
import {
  Film, Instagram, Linkedin, Twitter, Youtube,
  Mail, Phone, MapPin
} from "lucide-react";

export function Footer() {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <footer style={{ background: "#0D0D0D" }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-14 pt-20 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/[0.06]">
          <div className="lg:col-span-5">
            <Link to="/" onClick={handleScrollTop} className="flex items-center gap-3 mb-7 group inline-block">
              <img
                src="/logo.png"
                alt="Cre8tiveCove Logo"
                className="h-12 w-auto object-contain brightness-0 invert opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105"
              />
            </Link>
            <p className="text-sm leading-relaxed max-w-xs" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.65)" }}>
              A premium creative studio specializing in film, brand identity, and digital experiences for ambitious brands worldwide.
            </p>
            <div className="flex gap-3 mt-8">
              {[
                { Icon: Instagram, url: "https://www.instagram.com/cre8tivecove.cc/" },
                { Icon: Linkedin, url: "https://linkedin.com/company/cre8tivecove" },
                // { Icon: Twitter, url: "https://twitter.com/cre8tivecove" },
                { Icon: Youtube, url: "https://www.youtube.com/@CRE8TIVECOVE" }
              ].map(({ Icon, url }, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 hover:border-[#C8A96B] hover:bg-[#C8A96B15]"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                >
                  <Icon size={14} style={{ color: "rgba(255,255,255,0.7)" }} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "rgba(255,255,255,0.55)" }}>Pages</p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Home", path: "/" },
                { label: "Work", path: "/work" },
                { label: "Services", path: "/services" },
                { label: "About", path: "/about" },
                { label: "Careers", path: "/careers" },
                { label: "Contact", path: "/contact" }
              ].map(({ label, path }) => (
                <Link
                  key={label}
                  to={path}
                  onClick={handleScrollTop}
                  className="text-left text-[13px] transition-colors hover:text-white"
                  style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.65)" }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "rgba(255,255,255,0.55)" }}>Contact</p>
            <div className="flex flex-col gap-4">
              {[
                { Icon: Mail, text: "hello@cre8tivecove.com" },
                { Icon: Phone, text: "+91 99996 59129" },
                { Icon: MapPin, text: "Office No.5, Second floor, Dhanvarsha Complex, CS-3, Gyan Khand 1, Indirapuram, Ghaziabad, Uttar Pradesh 201014" },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon size={13} style={{ color: "#C8A96B" }} />
                  <span className="text-[13px]" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.65)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-[11px]" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.45)" }}>© 2024 Cre8tiveCove. All rights reserved.</p>
          <p className="text-[11px]" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.4)" }}>Created by cre8tivecove · Est. 2024</p>
        </div>
      </div>
    </footer>
  );
}
