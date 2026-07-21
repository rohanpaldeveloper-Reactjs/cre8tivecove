import { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router";
import { ArrowRight, ArrowUpRight, Play, Check, Star } from "lucide-react";
import { Reveal } from "../../components/public/Reveal.js";
import { api } from "../../api/client.js";
import * as Icons from "lucide-react";

// Helper to render lucide icon dynamically from DB string
function DynamicIcon({ name, size, className, style }: { name: string; size?: number; className?: string; style?: any }) {
  const IconComponent = (Icons as any)[name] || Icons.Film;
  return <IconComponent size={size} className={className} style={style} />;
}

// Fallback initial data in case API fails or is not seeded
const FALLBACK_HERO = {
  badge: "Award-Winning Creative Studio",
  headline: "We Create Stories That Move Brands.",
  subheading: "Corporate Films, Commercial Videos, Websites & Creative Experiences — crafted for brands that demand excellence.",
  ctaPrimaryText: "View Our Work",
  ctaPrimaryLink: "/work",
  ctaSecondaryText: "Book a Discovery Call",
  ctaSecondaryLink: "/contact",
  videoUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1100&h=900&fit=crop&auto=format",
  stats: [
    { val: "500+", lbl: "Projects Delivered" },
    { val: "3M+", lbl: "Total Views" },
    { val: "100+", lbl: "Happy Clients" }
  ]
};

const FALLBACK_PROCESS = {
  badge: "How We Work",
  title: "Strategy to screen — every step.",
  steps: [
    { title: "Strategy", desc: "Audience mapping, competitive analysis, and creative brief." },
    { title: "Concept", desc: "Moodboards, storyboards, and creative concept development." },
    { title: "Production", desc: "On-location or studio capture with cinema-grade equipment." },
    { title: "Post Production", desc: "Color grade, sound design, edit, and motion graphics." },
    { title: "Launch", desc: "Delivery across every platform with performance tracking." }
  ],
  image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&h=600&fit=crop&auto=format",
  imageBadge: "8 Years of Craft"
};

export default function HomePage() {
  const navigate = useNavigate();
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [hoveredWork, setHoveredWork] = useState<number | null>(null);
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  // States from API
  const [sections, setSections] = useState<Record<string, any>>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(s => (s + 1) % 5);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Fetch dynamic content
  useEffect(() => {
    async function loadData() {
      try {
        // 1. Fetch Home Page Configuration
        const pageData = await api.get("/content/pages/home");
        const mapped = pageData.sections.reduce((acc: any, sec: any) => {
          if (sec.isVisible) acc[sec.key] = sec.content;
          return acc;
        }, {});
        setSections(mapped);
      } catch (err) {
        console.warn("Using local fallback for page sections:", err);
      }

      try {
        // 2. Fetch Projects (Limit to featured or first 4)
        const allProjects = await api.get("/projects");
        const featured = allProjects.filter((p: any) => p.isFeatured).slice(0, 4);
        setProjects(featured.length > 0 ? featured : allProjects.slice(0, 4));
      } catch (err) {
        console.error("Failed to load projects:", err);
      }

      try {
        // 3. Fetch Testimonials
        const allTestimonials = await api.get("/testimonials");
        setTestimonials(allTestimonials.slice(0, 3));
      } catch (err) {
        console.error("Failed to load testimonials:", err);
      }

      try {
        // 4. Fetch Services (Limit to first 6)
        const allServices = await api.get("/services");
        setServices(allServices.slice(0, 6));
      } catch (err) {
        console.error("Failed to load services:", err);
      }
    }
    loadData();
  }, []);

  // Resolve section contents with fallback constants
  const hero = sections.hero || FALLBACK_HERO;
  const processSec = sections.process || FALLBACK_PROCESS;
  const ctaSec = sections.cta || { badge: "Let's Begin", title: "Ready to create something remarkable?", ctaText: "Let's Talk", ctaLink: "/contact" };

  const mediaUrl = hero.videoUrl
    ? (hero.videoUrl.startsWith("http") || hero.videoUrl.startsWith("data:") ? hero.videoUrl : `http://localhost:5001${hero.videoUrl}`)
    : "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1100&h=900&fit=crop&auto=format";

  const isVideo = typeof hero.videoUrl === "string" && (
    hero.videoUrl.endsWith(".mp4") ||
    hero.videoUrl.endsWith(".mov") ||
    hero.videoUrl.endsWith(".webm") ||
    hero.videoUrl.includes("/uploads/media/") ||
    hero.videoUrl.includes("video")
  );

  return (
    <div>
      {/* ── HERO BANNER ── */}
      <section className="h-screen w-full overflow-hidden relative flex items-center justify-center bg-black">
        {/* Full-width background video/image */}
        <div className="absolute inset-0 z-0 bg-black">
          {isVideo ? (
            <video
              src={mediaUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={mediaUrl}
              alt="Cinematic production"
              className="w-full h-full object-cover"
            />
          )}

          {/* Optional dark gradient overlay if text is enabled in CMS */}
          {hero.showText && (
            <div
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                background: "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)"
              }}
            />
          )}
        </div>

        {/* CMS Text Overlay (Rendered only if showText is enabled in CMS) */}
        {hero.showText && (
          <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-14 grid grid-cols-1 lg:grid-cols-2 pt-28 pb-16 lg:pt-0 lg:pb-0">
            {/* Left panel */}
            <div className="flex flex-col justify-center">
              <div
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? "none" : "translateY(24px)",
                  transition: "opacity 1s ease 0.2s, transform 1s ease 0.2s",
                }}
              >
                <div className="flex items-center gap-2.5 mb-10">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#C8A96B" }} />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C8A96B]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {hero.badge || "Award-Winning Creative Studio"}
                  </span>
                </div>
                <h1
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(3.2rem, 5.5vw, 5.8rem)",
                    fontWeight: 900,
                    lineHeight: 1.03,
                    color: "#fff",
                    letterSpacing: "-0.025em",
                  }}
                >
                  {hero.headline?.includes("Stories") ? (
                    <>
                      {hero.headline.split("Stories")[0]}
                      <em style={{ fontStyle: "italic", color: "#C8A96B" }}>Stories</em>
                      {hero.headline.split("Stories")[1]}
                    </>
                  ) : (
                    hero.headline || "We Create Stories That Move Brands."
                  )}
                </h1>
                <p
                  className="mt-8 text-lg max-w-[420px] leading-[1.75] text-white/80"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                >
                  {hero.subheading}
                </p>
                <div className="flex flex-wrap gap-4 mt-10">
                  <Link
                    to={hero.ctaPrimaryLink || "/work"}
                    className="group flex items-center gap-2.5 px-7 py-3.5 rounded-full text-[13px] font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#C8A96B", color: "#111" }}
                  >
                    {hero.ctaPrimaryText || "View Our Work"}
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    to={hero.ctaSecondaryLink || "/contact"}
                    className="group flex items-center gap-2 px-7 py-3.5 rounded-full text-[13px] font-semibold border border-white/20 text-white transition-all duration-300 hover:scale-105 hover:border-[#C8A96B] hover:text-[#C8A96B]"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {hero.ctaSecondaryText || "Book a Discovery Call"}
                  </Link>
                </div>
              </div>

              {/* Bottom stats strip */}
              <div
                className="flex gap-8 pt-12"
                style={{ opacity: heroLoaded ? 1 : 0, transition: "opacity 1s ease 0.8s" }}
              >
                {(hero.stats || FALLBACK_HERO.stats).map((item: any) => (
                  <div key={item.lbl}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "1.5rem", color: "#fff" }}>{item.val}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "rgba(255,255,255,0.6)", marginTop: 1 }}>{item.lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right panel */}
            <div className="relative min-h-[56vw] lg:min-h-0 flex items-center justify-center">
              <button
                onClick={() => navigate("/work")}
                className="group flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transition: "opacity 1s ease 1s, transform 0.3s ease",
                }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(12px)" }}
                >
                  <Play size={24} fill="white" className="text-white ml-1" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-white/70" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Watch Showreel
                </span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── MARQUEE ── */}
      {/* <div className="py-6 overflow-hidden border-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <div
          className="flex gap-16 whitespace-nowrap"
          style={{
            animation: "marquee 30s linear infinite",
            width: "max-content",
          }}
        >
          {[...Array(3)].flatMap(() =>
            ["Corporate Films", "Commercial Production", "Brand Identity", "Website Development", "UI/UX Design", "Product Videos", "Drone Cinematography", "Motion Graphics"].map((t, i) => (
              <span key={`${t}-${i}`} className="inline-flex items-center gap-4 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#aaa" }}>
                <span className="w-1 h-1 rounded-full inline-block" style={{ background: "#C8A96B" }} />
                {t}
              </span>
            ))
          )}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-33.33%) } }`}</style>
      </div> */}

      {/* ── FEATURED WORK ── */}
      {sections.selected_work !== false && (
        <section className="py-32 px-6 lg:px-14 max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>
                {sections.selected_work?.badge || "Selected Work"}
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 4vw, 3.75rem)", fontWeight: 900, color: "#111", lineHeight: 1.08, letterSpacing: "-0.02em" }}>
                {sections.selected_work?.title ? (
                  sections.selected_work.title.includes("categories") ? (
                    <>
                      {sections.selected_work.title.split("categories")[0]}
                      <em style={{ fontStyle: "italic" }}>categories.</em>
                      {sections.selected_work.title.split("categories")[1]}
                    </>
                  ) : sections.selected_work.title
                ) : (
                  <>Projects that define<br /><em style={{ fontStyle: "italic" }}>categories.</em></>
                )}
              </h2>
            </Reveal>
            <Reveal from="right">
              <Link
                to="/work"
                className="hidden lg:flex items-center gap-2 text-[13px] font-semibold group transition-all duration-200"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}
              >
                {sections.selected_work?.ctaText || "All Projects"}
                <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Reveal>
          </div>

          {/* Work grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {projects.map((item, i) => {
              const spans = [7, 5, 5, 7];
              const span = spans[i % 4];
              const tall = i % 4 === 1 || i % 4 === 2;

              // Handle unsplash id vs full url
              const imageUrl = item.thumbnailUrl.startsWith("http")
                ? item.thumbnailUrl
                : `https://images.unsplash.com/photo-${item.thumbnailUrl}?w=900&h=700&fit=crop&auto=format`;

              return (
                <Reveal key={item.id || i} delay={i * 0.1} className="contents">
                  <div
                    className={`relative overflow-hidden rounded-2xl cursor-pointer group`}
                    style={{
                      height: tall ? 520 : 420,
                      background: "#F3F3F3",
                      gridColumn: `span ${span}`,
                    }}
                    onClick={() => navigate(`/work/${item.slug}`)}
                    onMouseEnter={() => setHoveredWork(i)}
                    onMouseLeave={() => setHoveredWork(null)}
                  >
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
                      style={{ transform: hoveredWork === i ? "scale(1.06)" : "scale(1)" }}
                    />
                    <div
                      className="absolute inset-0 transition-opacity duration-500"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 55%)", opacity: hoveredWork === i ? 1 : 0.55 }}
                    />

                    {/* Hover badge */}
                    <div
                      className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-400"
                      style={{
                        background: "rgba(255,255,255,0.12)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        opacity: hoveredWork === i ? 1 : 0,
                        transform: hoveredWork === i ? "scale(1)" : "scale(0.8)",
                      }}
                    >
                      <ArrowUpRight size={16} className="text-white" />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-7">
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: "#C8A96B", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {item.category}
                      </span>
                      <h3 className="mt-1.5 text-xl font-bold text-white leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {item.title}
                      </h3>
                      <p
                        className="text-[12px] text-white/50 mt-2 transition-all duration-300"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          opacity: hoveredWork === i ? 1 : 0,
                          transform: hoveredWork === i ? "translateY(0)" : "translateY(6px)",
                        }}
                      >
                        Learn Case Study
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* ── SERVICES ── */}
      {sections.services_teaser !== false && services.length > 0 && (
        <section style={{ background: "#F7F7F7" }} className="py-32 px-6 lg:px-14">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-20 mb-16">
              <Reveal className="flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>
                  {sections.services_teaser?.badge || "What We Do"}
                </p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 4vw, 3.75rem)", fontWeight: 900, color: "#111", lineHeight: 1.08, letterSpacing: "-0.02em" }}>
                  {sections.services_teaser?.title ? (
                    sections.services_teaser.title.includes("services") ? (
                      <>
                        {sections.services_teaser.title.split("services")[0]}
                        <em style={{ fontStyle: "italic" }}>services.</em>
                        {sections.services_teaser.title.split("services")[1]}
                      </>
                    ) : sections.services_teaser.title
                  ) : (
                    <>Full-spectrum<br /><em style={{ fontStyle: "italic" }}>creative services.</em></>
                  )}
                </h2>
              </Reveal>
              <Reveal delay={0.1} className="max-w-sm">
                <p className="text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", color: "#888" }}>
                  {sections.services_teaser?.description || "From a single hero film to a complete brand overhaul — every engagement receives the same obsessive level of craft."}
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((s, i) => (
                <Reveal key={s.id || i} delay={i * 0.07}>
                  <div
                    className="group bg-white rounded-2xl p-8 cursor-pointer transition-all duration-400 hover:-translate-y-1"
                    style={{
                      boxShadow: hoveredService === i ? "0 24px 64px rgba(0,0,0,0.1)" : "0 1px 12px rgba(0,0,0,0.05)",
                    }}
                    onClick={() => navigate(`/services/${s.slug}`)}
                    onMouseEnter={() => setHoveredService(i)}
                    onMouseLeave={() => setHoveredService(null)}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-6 transition-all duration-300"
                      style={{ background: hoveredService === i ? "#C8A96B" : "rgba(200,169,107,0.1)" }}
                    >
                      <DynamicIcon name={s.icon} size={18} style={{ color: hoveredService === i ? "#fff" : "#C8A96B" }} />
                    </div>
                    <h3 className="text-base font-bold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}>{s.title}</h3>
                    <p className="text-sm" style={{ fontFamily: "'Inter', sans-serif", color: "#888", lineHeight: 1.6 }}>{s.shortDescription}</p>
                    <div
                      className="flex items-center gap-1.5 mt-6 transition-all duration-200"
                      style={{ color: "#C8A96B" }}
                    >
                      <span className="text-[12px] font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Learn more</span>
                      <ArrowRight size={11} />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PROCESS + STATS ── */}
      {sections.process !== false && (
        <section className="py-32 px-6 lg:px-14 max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/* Process list */}
            <div>
              <Reveal>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>
                  {processSec.badge || "How We Work"}
                </p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 900, color: "#111", lineHeight: 1.1, letterSpacing: "-0.02em" }} className="mb-12">
                  {processSec.title ? (
                    processSec.title.includes("step") ? (
                      <>
                        {processSec.title.split("step")[0]}
                        <em style={{ fontStyle: "italic" }}>every step.</em>
                      </>
                    ) : processSec.title
                  ) : (
                    <>Strategy to screen —<br /><em style={{ fontStyle: "italic" }}>every step.</em></>
                  )}
                </h2>
              </Reveal>
              {(processSec.steps || FALLBACK_PROCESS.steps).map((step: any, i: number) => (
                <Reveal key={step.title} delay={i * 0.1}>
                  <div
                    className="flex gap-5 pb-8 relative cursor-pointer group transition-all duration-300"
                    onClick={() => setActiveStep(i)}
                  >
                    {i < 4 && (
                      <div
                        className="absolute left-5 top-10 bottom-0 w-px"
                        style={{ background: activeStep >= i ? "#C8A96B" : "#E8E8E8", transition: "background 0.5s" }}
                      />
                    )}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-[11px] font-bold transition-all duration-300"
                      style={{
                        background: activeStep === i ? "#C8A96B" : activeStep > i ? "#111" : "#F7F7F7",
                        color: activeStep >= i ? "#fff" : "#aaa",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        border: activeStep === i ? "2px solid #C8A96B" : "none",
                      }}
                    >
                      {activeStep > i ? <Check size={14} /> : String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="pt-2">
                      <h4
                        className="font-bold text-sm transition-colors duration-200"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: activeStep === i ? "#111" : "#aaa" }}
                      >
                        {step.title}
                      </h4>
                      <p
                        className="text-[13px] mt-1 leading-relaxed overflow-hidden transition-all duration-400"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          color: "#888",
                          maxHeight: activeStep === i ? "80px" : "0",
                          opacity: activeStep === i ? 1 : 0,
                        }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Stats & image */}
            <div>
              <Reveal delay={0.2}>
                <div className="relative rounded-2xl overflow-hidden mb-5" style={{ height: 380, background: "#F7F7F7" }}>
                  <img
                    src={processSec.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&h=600&fit=crop&auto=format"}
                    alt="Our team at work"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />
                  <div className="absolute bottom-6 left-6">
                    <span
                      className="text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                      style={{ background: "#C8A96B", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {processSec.imageBadge || "8 Years of Craft"}
                    </span>
                  </div>
                </div>
              </Reveal>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { v: "500+", l: "Projects" },
                  { v: "3M+", l: "Views" },
                  { v: "100+", l: "Clients" }
                ].map((item, i) => (
                  <Reveal key={item.l} delay={0.3 + i * 0.05}>
                    <div className="rounded-2xl p-6 text-center" style={{ background: "#F7F7F7" }}>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 900, color: "#111" }}>{item.v}</div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#aaa", marginTop: 3 }}>{item.l}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      {sections.testimonials !== false && testimonials.length > 0 && (
        <section style={{ background: "#F7F7F7" }} className="py-32 px-6 lg:px-14">
          <div className="max-w-[1440px] mx-auto">
            <Reveal className="text-center mb-16">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>
                {sections.testimonials?.badge || "Client Stories"}
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 4vw, 3.75rem)", fontWeight: 900, color: "#111", lineHeight: 1.08, letterSpacing: "-0.02em" }}>
                {sections.testimonials?.title || "What our clients say."}
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonials.map((t, i) => {
                const avatarUrl = t.clientPhoto?.startsWith("http")
                  ? t.clientPhoto
                  : `https://images.unsplash.com/photo-${t.clientPhoto || "1507003211169-0a1dd7228f2d"}?w=80&h=80&fit=crop&auto=format`;

                return (
                  <Reveal key={t.id || i} delay={i * 0.12}>
                    <div className="bg-white rounded-2xl p-8 flex flex-col h-full" style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.055)" }}>
                      <div className="flex gap-0.5 mb-5">
                        {[...Array(t.rating || 5)].map((_, j) => (
                          <Star key={j} size={12} fill="#C8A96B" style={{ color: "#C8A96B" }} />
                        ))}
                      </div>
                      <blockquote
                        className="text-sm leading-[1.8] flex-1"
                        style={{ fontFamily: "'Inter', sans-serif", color: "#555", fontStyle: "italic" }}
                      >
                        &ldquo;{t.quote}&rdquo;
                      </blockquote>
                      <div className="flex items-center gap-3 mt-7 pt-6 border-t border-gray-100">
                        <img
                          src={avatarUrl}
                          alt={t.clientName}
                          className="w-10 h-10 rounded-full object-cover bg-gray-200 flex-shrink-0"
                        />
                        <div>
                          <p className="text-[13px] font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}>{t.clientName}</p>
                          <p className="text-[11px] mt-0.5" style={{ fontFamily: "'Inter', sans-serif", color: "#bbb" }}>Client</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── BEHIND THE SCENES ── */}
      {sections.behind_scenes !== false && (
        <section className="py-32 px-6 lg:px-14 max-w-[1440px] mx-auto">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>
              {sections.behind_scenes?.badge || "Behind the Lens"}
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 4vw, 3.75rem)", fontWeight: 900, color: "#111", lineHeight: 1.08, letterSpacing: "-0.02em" }} className="mb-16">
              {sections.behind_scenes?.title ? (
                sections.behind_scenes.title.includes("magic") ? (
                  <>
                    {sections.behind_scenes.title.split("magic")[0]}
                    <em style={{ fontStyle: "italic" }}>happens.</em>
                  </>
                ) : sections.behind_scenes.title
              ) : (
                <>Where the magic<br /><em style={{ fontStyle: "italic" }}>happens.</em></>
              )}
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            {(sections.behind_scenes?.items || [
              { img: "1485846234645-a62644f84728", label: "Camera Ops", h: 300, mt: 0 },
              { img: "1508739773434-c26b3d09e071", label: "Drone Shoots", h: 380, mt: 48 },
              { img: "1574717024653-61fd2cf4d44d", label: "Cinematography", h: 380, mt: 0 },
              { img: "1531403236541-e5f16c22a4c3", label: "Editing Suite", h: 300, mt: 48 }
            ]).map((item: any, i: number) => (
              <Reveal key={i} delay={i * 0.1}>
                <div
                  className="relative overflow-hidden rounded-2xl group cursor-pointer"
                  style={{ height: item.h, marginTop: item.mt, background: "#F3F3F3" }}
                >
                  <img
                    src={`https://images.unsplash.com/photo-${item.img}?w=500&h=600&fit=crop&auto=format`}
                    alt={item.label}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100" style={{ background: "rgba(0,0,0,0.38)" }} />
                  <div
                    className="absolute bottom-5 left-5 transition-all duration-300 opacity-0 group-hover:opacity-100"
                    style={{ transform: "translateY(4px)" }}
                  >
                    <span className="text-xs font-semibold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.label}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      {sections.cta !== false && (
        <section className="mx-4 lg:mx-14 mb-24">
          <div
            className="relative overflow-hidden rounded-3xl px-8 lg:px-20 py-24 text-center"
            style={{ background: "#111" }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(200,169,107,0.14) 0%, transparent 65%)" }} />
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>
                {ctaSec.badge || "Let's Begin"}
              </p>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1.07,
                  letterSpacing: "-0.02em",
                }}
                className="mb-10"
              >
                {ctaSec.title ? (
                  ctaSec.title.includes("remarkable") ? (
                    <>
                      {ctaSec.title.split("remarkable")[0]}
                      <em style={{ fontStyle: "italic", color: "#C8A96B" }}>something remarkable?</em>
                    </>
                  ) : ctaSec.title
                ) : (
                  <>Ready to create<br /><em style={{ fontStyle: "italic", color: "#C8A96B" }}>something remarkable?</em></>
                )}
              </h2>
              <button
                onClick={() => navigate(ctaSec.ctaLink || "/contact")}
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-[13px] font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                style={{ background: "#C8A96B", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {ctaSec.ctaText || "Let's Talk"}
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </Reveal>
          </div>
        </section>
      )}
    </div>
  );
}
