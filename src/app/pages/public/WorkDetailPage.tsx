import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ChevronRight, Eye, TrendingUp, Award, Star, ArrowRight } from "lucide-react";
import { Reveal } from "../../components/public/Reveal.js";
import { api } from "../../api/client.js";

export default function WorkDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [nextProject, setNextProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjectDetails() {
      setLoading(true);
      try {
        const currentData = await api.get(`/projects/${slug}`);
        setProject(currentData);

        // Fetch all projects to find the "Next Project"
        const allProjects = await api.get("/projects");
        const idx = allProjects.findIndex((p: any) => p.slug === slug);
        if (idx !== -1 && allProjects.length > 1) {
          const nextIdx = (idx + 1) % allProjects.length;
          setNextProject(allProjects[nextIdx]);
        }
      } catch (err) {
        console.error("Failed to load project details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProjectDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-[76px] min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-[76px] min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Case Study Not Found</h2>
        <Link to="/work" className="text-sm text-[#C8A96B] hover:underline">Back to all projects</Link>
      </div>
    );
  }

  const heroImage = project.thumbnailUrl.startsWith("http")
    ? project.thumbnailUrl
    : `https://images.unsplash.com/photo-${project.thumbnailUrl}?w=1800&h=900&fit=crop&auto=format`;

  const processSteps = Array.isArray(project.processSteps) ? project.processSteps : [];
  const results = Array.isArray(project.results) ? project.results : [];
  const gallery = Array.isArray(project.gallery) ? project.gallery : [];

  const handleNextProjectClick = () => {
    if (nextProject) {
      navigate(`/work/${nextProject.slug}`);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  return (
    <div className="pt-[76px]">
      {/* Hero */}
      <section className="relative h-[75vh] overflow-hidden">
        <img
          src={heroImage}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 55%)" }} />
        <Link
          to="/work"
          className="absolute top-24 left-6 lg:left-14 flex items-center gap-2 text-[12px] font-semibold text-white/60 hover:text-white transition-colors"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <ChevronRight size={14} style={{ transform: "rotate(180deg)" }} /> All Projects
        </Link>
        <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-14 pb-16 max-w-[1440px] mx-auto">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full" style={{ background: "#C8A96B", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {project.category}
              </span>
              <span className="text-[12px]" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.45)" }}>Cre8tiveCove Campaign</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 900, color: "#fff", lineHeight: 1.06, letterSpacing: "-0.025em" }}>
              {project.title}
            </h1>
          </Reveal>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-14">
        {/* Meta row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 py-12 border-b border-gray-100">
          {[
            { label: "Client Category", value: project.category },
            { label: "Project Phase", value: "Completed Case Study" },
            { label: "Obsessive Craft", value: "Cinema Grade" },
            { label: "Deliverables", value: "Master Assets Pack" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>{label}</p>
              <p className="text-sm font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Overview / Challenge / Solution */}
        {[
          { heading: "The Brief", body: project.overview },
          { heading: "The Challenge", body: project.challenge || "Balancing premium creative layouts with strict industry standards while conveying narrative emotion." },
          { heading: "Our Solution", body: project.solution || "Formulating structured visual pacing, high-end post grading, and responsive assets mapping." },
        ].map(({ heading, body }) => (
          <section key={heading} className="py-16 border-b border-gray-100 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <Reveal>
                <h2 className="text-xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}>{heading}</h2>
              </Reveal>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <Reveal delay={0.1}>
                <p className="text-[15px] leading-[1.9] text-[#666]" style={{ fontFamily: "'Inter', sans-serif" }}>{body}</p>
              </Reveal>
            </div>
          </section>
        ))}

        {/* Results */}
        {results.length > 0 && (
          <section className="py-20 border-b border-gray-100">
            <Reveal>
              <h2 className="text-xl font-bold mb-12" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}>Results</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {results.map(({ stat, label }: any, idx: number) => {
                const icons = [Eye, TrendingUp, Award];
                const Icon = icons[idx % 3];

                return (
                  <Reveal key={label} delay={idx * 0.1}>
                    <div className="p-8 rounded-2xl text-center" style={{ background: "#F7F7F7" }}>
                      <Icon size={22} style={{ color: "#C8A96B", margin: "0 auto 16px" }} />
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 900, color: "#111" }}>{stat}</div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#aaa", marginTop: 6 }}>{label}</div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>
        )}

        {/* Gallery */}
        {gallery.length > 0 && (
          <section className="py-20">
            <Reveal>
              <h2 className="text-xl font-bold mb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}>Gallery</h2>
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map((img: string, i: number) => {
                const heights = [280, 360, 360, 280, 280, 360];
                const h = heights[i % heights.length];
                const imageUrl = img.startsWith("http")
                  ? img
                  : `https://images.unsplash.com/photo-${img}?w=600&h=500&fit=crop&auto=format`;

                return (
                  <Reveal key={i} delay={i * 0.08}>
                    <div className="relative overflow-hidden rounded-2xl group" style={{ height: h, background: "#F3F3F3" }}>
                      <img
                        src={imageUrl}
                        alt="Production still"
                        className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
                      />
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>
        )}

        {/* Client feedback */}
        {project.clientFeedback && (
          <section className="py-16 border-t border-gray-100">
            <Reveal>
              <blockquote className="max-w-2xl">
                <div className="flex gap-0.5 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#C8A96B" style={{ color: "#C8A96B" }} />)}
                </div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.25rem, 2vw, 1.75rem)", fontStyle: "italic", color: "#111", lineHeight: 1.5, fontWeight: 700 }}>
                  &ldquo;{project.clientFeedback}&rdquo;
                </p>
                {project.clientName && (
                  <div className="flex items-center gap-3 mt-8">
                    {project.clientAvatar && (
                      <img
                        src={project.clientAvatar.startsWith("http") ? project.clientAvatar : `https://images.unsplash.com/photo-${project.clientAvatar}?w=80&h=80&fit=crop&auto=format`}
                        alt={project.clientName}
                        className="w-11 h-11 rounded-full object-cover bg-gray-200"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}>{project.clientName}</p>
                      <p className="text-[12px]" style={{ fontFamily: "'Inter', sans-serif", color: "#bbb" }}>{project.clientRole || "Product Manager"}</p>
                    </div>
                  </div>
                )}
              </blockquote>
            </Reveal>
          </section>
        )}

        {/* Next project */}
        {nextProject && (
          <section className="py-16 border-t border-gray-100 mb-8">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>Next Project</p>
              <div
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
                style={{ height: 280, background: "#F3F3F3" }}
                onClick={handleNextProjectClick}
              >
                <img
                  src={nextProject.thumbnailUrl.startsWith("http") ? nextProject.thumbnailUrl : `https://images.unsplash.com/photo-${nextProject.thumbnailUrl}?w=1400&h=400&fit=crop&auto=format`}
                  alt={nextProject.title}
                  className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-104"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
                <div className="absolute inset-0 flex items-center px-10">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#C8A96B", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{nextProject.category}</span>
                    <h3 className="mt-1.5 text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{nextProject.title}</h3>
                  </div>
                </div>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <ArrowRight size={18} className="text-white" />
                </div>
              </div>
            </Reveal>
          </section>
        )}
      </div>
    </div>
  );
}
