import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Reveal } from "../../components/public/Reveal.js";
import { api } from "../../api/client.js";
import * as Icons from "lucide-react";

function DynamicIcon({ name, size, className, style }: { name: string; size?: number; className?: string; style?: any }) {
  const IconComponent = (Icons as any)[name] || Icons.Film;
  return <IconComponent size={size} className={className} style={style} />;
}

export default function ServicesPage() {
  const navigate = useNavigate();
  const [pageMeta, setPageMeta] = useState<any>({
    title: "Services",
    content: {
      badge: "Services",
      title: "Creative services built for modern brands.",
      description: "From a single hero film to a complete brand overhaul — we bring the same obsessive craft to every engagement, at any scale."
    }
  });
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const pageData = await api.get("/content/pages/services");
        const mappedHero = pageData.sections.find((s: any) => s.key === "hero");
        if (mappedHero) {
          setPageMeta({
            title: pageData.title,
            content: mappedHero.content
          });
        }
      } catch (err) {
        console.warn("Using fallback metadata for services listing page:", err);
      }

      try {
        const allServices = await api.get("/services");
        setServices(allServices);
      } catch (err) {
        console.error("Failed to load services list:", err);
      }
    }
    loadData();
  }, []);

  const content = pageMeta.content;

  return (
    <div className="pt-[76px]">
      <section className="py-28 px-6 lg:px-14 max-w-[1440px] mx-auto">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>
            {content.badge || "Services"}
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 6vw, 5.5rem)", fontWeight: 900, color: "#111", lineHeight: 1.04, letterSpacing: "-0.025em" }} className="mb-6">
            {content.title?.includes("modern brands") ? (
              <>
                {content.title.split("modern brands")[0]}
                <em style={{ fontStyle: "italic" }}>modern brands.</em>
              </>
            ) : (
              content.title || "Creative services built for modern brands."
            )}
          </h1>
          <p className="text-[15px] leading-relaxed max-w-xl" style={{ fontFamily: "'Inter', sans-serif", color: "#888" }}>
            {content.description}
          </p>
        </Reveal>
      </section>

      {/* Services list */}
      <section className="pb-32 px-6 lg:px-14 max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-6">
          {services.map((s, i) => {
            const stockImg = s.heroVideoUrl?.startsWith("http")
              ? s.heroVideoUrl
              : "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=500&fit=crop&auto=format";

            const deliverables = Array.isArray(s.deliverables) ? s.deliverables.slice(0, 3) : [];

            return (
              <Reveal key={s.id || i} delay={0.05 * i}>
                <div
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 lg:p-7 rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:border-[#C8A96B]/40 hover:shadow-xl hover:shadow-black/5 group cursor-pointer"
                  style={{ borderColor: "#eaeaea" }}
                  onClick={() => {
                    navigate(`/services/${s.slug}`);
                    window.scrollTo({ top: 0, behavior: "instant" });
                  }}
                >
                  {/* Stock Image Thumbnail */}
                  <div className="lg:col-span-3 overflow-hidden rounded-2xl h-36 relative">
                    <img
                      src={stockImg}
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 w-9 h-9 rounded-xl flex items-center justify-center bg-black/60 backdrop-blur-md text-white border border-white/20">
                      <DynamicIcon name={s.icon} size={16} style={{ color: "#C8A96B" }} />
                    </div>
                  </div>

                  {/* Title & Short Description */}
                  <div className="lg:col-span-6 flex flex-col justify-center">
                    <h3 className="font-bold text-xl mb-2 text-[#111] group-hover:text-[#C8A96B] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {s.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed text-gray-500 mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {s.shortDescription}
                    </p>

                    {/* Deliverable pills */}
                    {deliverables.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {deliverables.map((item: any) => (
                          <span
                            key={item.label}
                            className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600 border border-gray-200/60"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                          >
                            ✓ {item.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CTA button */}
                  <div className="lg:col-span-3 flex items-center justify-end">
                    <button
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[13px] font-semibold transition-all duration-300 group-hover:bg-[#C8A96B] group-hover:text-white cursor-pointer shadow-sm"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#111", color: "#fff" }}
                    >
                      Explore Service <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}
