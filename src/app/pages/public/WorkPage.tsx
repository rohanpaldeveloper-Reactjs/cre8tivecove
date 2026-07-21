import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowUpRight, Search, X, ExternalLink, Sparkles, Film, Palette, Cpu, Video, CheckCircle2 } from "lucide-react";
import { Reveal } from "../../components/public/Reveal.js";
import { api } from "../../api/client.js";

const CATEGORY_ICONS: Record<string, any> = {
  "All": Sparkles,
  "TVC & Commercials": Film,
  "Brand Campaigns": Palette,
  "CGI & AI Commercials": Cpu,
  "Corporate AV & Testimonials": Video,
};

export default function WorkPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [quickViewProject, setQuickViewProject] = useState<any | null>(null);

  useEffect(() => {
    document.title = "Portfolio & Work | Cre8tiveCove";
    async function loadProjects() {
      try {
        const allProjects = await api.get("/projects");
        setProjects(allProjects);

        // Predefined category order or distinct categories
        const distinct = Array.from(new Set(allProjects.map((p: any) => p.category))) as string[];
        const orderedCategories = [
          "All",
          "TVC & Commercials",
          "Brand Campaigns",
          "CGI & AI Commercials",
          "Corporate AV & Testimonials",
          ...distinct.filter(
            (c) =>
              !["TVC & Commercials", "Brand Campaigns", "CGI & AI Commercials", "Corporate AV & Testimonials"].includes(c)
          ),
        ];
        setCategories(orderedCategories);
      } catch (err) {
        console.error("Failed to load projects:", err);
      }
    }
    loadProjects();
  }, []);

  // Filter projects by category & search query
  const filtered = projects.filter((w) => {
    const matchesCategory = activeFilter === "All" || w.category === activeFilter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.overview.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Calculate project count per category
  const getCategoryCount = (cat: string) => {
    if (cat === "All") return projects.length;
    return projects.filter((p) => p.category === cat).length;
  };

  return (
    <div className="pt-[76px] bg-[#FAF9F6] min-h-screen">
      <section className="py-20 px-6 lg:px-14 max-w-[1440px] mx-auto">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-black/10 pb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111] text-[#C8A96B] text-[11px] font-bold uppercase tracking-[0.15em] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <Sparkles size={12} /> Cre8tiveCove Portfolio
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.75rem, 5.5vw, 5rem)", fontWeight: 900, color: "#111", lineHeight: 1.05, letterSpacing: "-0.025em" }}>
                Crafted for impact.<br />
                Categorized by <em style={{ fontStyle: "italic", color: "#C8A96B" }}>excellence.</em>
              </h1>
            </div>

            {/* Behance Direct Banner Badge */}
            <a
              href="https://www.behance.net/ashishnwh29"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white border border-black/10 shadow-sm hover:shadow-md transition-all duration-300 group hover:border-[#1769FF]"
            >
              <div className="w-8 h-8 rounded-full bg-[#1769FF] text-white flex items-center justify-center font-bold text-xs">
                Bē
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Official Profile</p>
                <p className="text-[13px] font-bold text-gray-900 flex items-center gap-1 group-hover:text-[#1769FF] transition-colors">
                  Ashish Mishrra on Behance <ExternalLink size={13} />
                </p>
              </div>
            </a>
          </div>
        </Reveal>

        {/* Search & Category Filter Header */}
        <div className="space-y-6 mb-12">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects by title, client, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-full bg-white border border-black/10 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black/30 transition-colors shadow-sm"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat] || Sparkles;
              const count = getCategoryCount(cat);
              const isActive = activeFilter === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-semibold transition-all duration-200 cursor-pointer border"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    background: isActive ? "#111" : "#fff",
                    color: isActive ? "#fff" : "#444",
                    borderColor: isActive ? "#111" : "rgba(0,0,0,0.08)",
                    boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
                  }}
                >
                  <Icon size={13} className={isActive ? "text-[#C8A96B]" : "text-gray-400"} />
                  <span>{cat}</span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                    style={{
                      background: isActive ? "rgba(255,255,255,0.2)" : "#F3F3F3",
                      color: isActive ? "#fff" : "#888",
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-8 text-[12px] text-gray-500 font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <p>Showing <span className="text-black font-bold">{filtered.length}</span> {filtered.length === 1 ? "project" : "projects"}</p>
          {activeFilter !== "All" && (
            <button
              onClick={() => { setActiveFilter("All"); setSearchQuery(""); }}
              className="text-[#C8A96B] hover:underline cursor-pointer font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-black/5 p-8">
            <p className="text-gray-400 text-sm mb-4">No projects match your filter or search query.</p>
            <button
              onClick={() => { setActiveFilter("All"); setSearchQuery(""); }}
              className="px-6 py-2.5 rounded-full bg-[#111] text-white text-xs font-semibold hover:bg-black transition-colors"
            >
              Show All Projects
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((w, i) => {
              const imageUrl = w.thumbnailUrl.startsWith("http")
                ? w.thumbnailUrl
                : `https://images.unsplash.com/photo-${w.thumbnailUrl}?w=700&h=500&fit=crop&auto=format`;

              return (
                <div
                  key={w.id || i}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => {
                    navigate(`/work/${w.slug}`);
                    window.scrollTo({ top: 0, behavior: "instant" });
                  }}
                  style={{
                    opacity: 0,
                    transform: "translateY(20px)",
                    animation: "none",
                  }}
                  ref={(el) => {
                    if (!el) return;
                    const obs = new IntersectionObserver(
                      ([e]) => {
                        if (e.isIntersecting) {
                          el.style.transition = `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s`;
                          el.style.opacity = "1";
                          el.style.transform = "none";
                          obs.disconnect();
                        }
                      },
                      { threshold: 0.05 }
                    );
                    obs.observe(el);
                  }}
                >
                  {/* Media Container */}
                  <div>
                    <div className="relative overflow-hidden bg-gray-100" style={{ height: 260 }}>
                      <img
                        src={imageUrl}
                        alt={w.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out"
                        style={{ transform: hovered === i ? "scale(1.08)" : "scale(1)" }}
                      />

                      {/* Overlay */}
                      <div
                        className="absolute inset-0 transition-opacity duration-300 flex items-center justify-center gap-3"
                        style={{ background: "rgba(0,0,0,0.55)", opacity: hovered === i ? 1 : 0 }}
                      >
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                          <ArrowUpRight size={18} />
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickViewProject(w);
                          }}
                          className="px-4 py-2 rounded-full bg-white text-black text-[11px] font-bold tracking-wider uppercase hover:bg-[#C8A96B] hover:text-white transition-all shadow-lg"
                        >
                          Quick View
                        </button>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm"
                          style={{
                            background: "rgba(17,17,17,0.85)",
                            color: "#fff",
                            backdropFilter: "blur(8px)",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {w.category}
                        </span>
                        {w.isFeatured && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#C8A96B] text-white shadow-sm flex items-center gap-1">
                            <Sparkles size={10} /> Featured
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3
                        className="font-bold text-[16px] text-gray-900 leading-snug group-hover:text-[#C8A96B] transition-colors"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {w.title}
                      </h3>
                      <p
                        className="text-[13px] text-gray-500 mt-2 line-clamp-2 leading-relaxed"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {w.overview}
                      </p>
                    </div>
                  </div>

                  {/* Footer Card Row */}
                  <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-black/5 mt-auto">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Cre8tiveCove Case Study
                    </span>
                    <span className="text-[12px] font-semibold text-[#111] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      View <ArrowUpRight size={13} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Behance Footer CTA Section */}

      </section>

      {/* Quick View Modal */}
      {quickViewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
            {/* Header / Close */}
            <button
              onClick={() => setQuickViewProject(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Image */}
            <div className="relative h-64 bg-gray-900 shrink-0">
              <img
                src={
                  quickViewProject.thumbnailUrl.startsWith("http")
                    ? quickViewProject.thumbnailUrl
                    : `https://images.unsplash.com/photo-${quickViewProject.thumbnailUrl}?w=1200&h=600&fit=crop&auto=format`
                }
                alt={quickViewProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#C8A96B] text-white mb-2 inline-block">
                  {quickViewProject.category}
                </span>
                <h3 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {quickViewProject.title}
                </h3>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Overview</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{quickViewProject.overview}</p>
              </div>

              {quickViewProject.challenge && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Challenge</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{quickViewProject.challenge}</p>
                </div>
              )}

              {quickViewProject.solution && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Solution</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{quickViewProject.solution}</p>
                </div>
              )}

              {Array.isArray(quickViewProject.results) && quickViewProject.results.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">Key Impact</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {quickViewProject.results.map((res: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-[#C8A96B]" />
                        <div>
                          <p className="text-base font-bold text-gray-900">{res.stat}</p>
                          <p className="text-xs text-gray-500">{res.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
              <a
                href="https://www.behance.net/ashishnwh29"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#1769FF] flex items-center gap-1 hover:underline"
              >
                View on Behance <ExternalLink size={13} />
              </a>
              <button
                onClick={() => {
                  const slug = quickViewProject.slug;
                  setQuickViewProject(null);
                  navigate(`/work/${slug}`);
                  window.scrollTo({ top: 0, behavior: "instant" });
                }}
                className="px-6 py-2.5 rounded-full bg-[#111] text-white text-xs font-bold hover:bg-black transition-colors"
              >
                Read Full Case Study
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

