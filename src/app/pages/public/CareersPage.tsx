import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Camera, Globe, TrendingUp, Zap, Users, Star, ArrowRight } from "lucide-react";
import { Reveal } from "../../components/public/Reveal.js";
import { api } from "../../api/client.js";
import * as Icons from "lucide-react";

function DynamicIcon({ name, size, className, style }: { name: string; size?: number; className?: string; style?: any }) {
  const IconComponent = (Icons as any)[name] || Icons.Camera;
  return <IconComponent size={size} className={className} style={style} />;
}

const FALLBACK_HERO = {
  badge: "Careers",
  title: "Join a team that loves creating.",
  description: "We're a studio of makers, thinkers, and storytellers. If you obsess over craft and believe great work changes culture, you'll feel at home.",
  image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=700&fit=crop&auto=format",
  imageBadge: "24 Creatives & Counting"
};

const FALLBACK_BENEFITS = {
  title: "Why Cre8tiveCove",
  items: [
    { icon: "Camera", title: "Cinema-grade tools", body: "Work with ARRI Alexa, Sony VENICE, and state-of-the-art post suites." },
    { icon: "Globe", title: "Remote-friendly", body: "Flexible remote options for most roles, with our beautiful LA studio as home base." },
    { icon: "TrendingUp", title: "Growth-first culture", body: "Dedicated $3K learning budget, mentorship, and transparent paths to leadership." },
    { icon: "Zap", title: "Competitive pay", body: "Market-leading salaries, equity options, and comprehensive health benefits." },
    { icon: "Users", title: "Creative autonomy", body: "We hire experts and trust their judgment. Your ideas shape the final work." },
    { icon: "Star", title: "Meaningful clients", body: "Partner with brands that value excellence and give you space to do great things." }
  ]
};

export default function CareersPage() {
  const navigate = useNavigate();
  const [activeDept, setActiveDept] = useState("All");
  const [sections, setSections] = useState<Record<string, any>>({});
  const [jobs, setJobs] = useState<any[]>([]);
  const [departments, setDepartments] = useState<string[]>(["All"]);

  useEffect(() => {
    document.title = "Careers & Opportunities | Cre8tiveCove";
    async function loadData() {
      try {
        const pageData = await api.get("/content/pages/careers");
        const mapped = pageData.sections.reduce((acc: any, sec: any) => {
          if (sec.isVisible) acc[sec.key] = sec.content;
          return acc;
        }, {});
        setSections(mapped);
      } catch (err) {
        console.warn("Using fallback metadata for careers page sections:", err);
      }

      try {
        const openJobs = await api.get("/jobs");
        setJobs(openJobs);

        // Compile distinct departments
        const distinct = Array.from(new Set(openJobs.map((j: any) => j.department))) as string[];
        setDepartments(["All", ...distinct]);
      } catch (err) {
        console.error("Failed to load open jobs:", err);
      }
    }
    loadData();
  }, []);

  const hero = sections.hero || FALLBACK_HERO;
  const benefits = sections.benefits || FALLBACK_BENEFITS;

  const filteredJobs = activeDept === "All"
    ? jobs
    : jobs.filter((j) => j.department === activeDept);

  return (
    <div className="pt-[76px]">
      {/* Hero */}
      <section className="py-28 px-6 lg:px-14 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>
              {hero.badge}
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 5vw, 4.75rem)", fontWeight: 900, color: "#111", lineHeight: 1.06, letterSpacing: "-0.025em" }}>
              {hero.title?.includes("creating") ? (
                <>
                  {hero.title.split("creating")[0]}
                  <em style={{ fontStyle: "italic" }}>creating.</em>
                </>
              ) : (
                hero.title
              )}
            </h1>
            <p className="mt-7 text-[15px] leading-[1.8] max-w-md" style={{ fontFamily: "'Inter', sans-serif", color: "#888" }}>
              {hero.description}
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <div className="relative rounded-2xl overflow-hidden" style={{ height: 440, background: "#F7F7F7" }}>
            <img
              src={hero.image}
              alt="Studio culture"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)" }} />
            <div className="absolute bottom-6 left-6">
              <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full" style={{ background: "#C8A96B", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {hero.imageBadge || "24 Creatives & Counting"}
              </span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Benefits */}
      {sections.benefits !== false && (
        <section style={{ background: "#F7F7F7" }} className="py-20 px-6 lg:px-14">
          <div className="max-w-[1440px] mx-auto">
            <Reveal><h2 className="text-2xl font-bold mb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}>{benefits.title}</h2></Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(benefits.items || FALLBACK_BENEFITS.items).map((item: any) => (
                <Reveal key={item.title}>
                  <div className="bg-white p-8 rounded-2xl h-full">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(200,169,107,0.1)" }}>
                      <DynamicIcon name={item.icon} size={17} style={{ color: "#C8A96B" }} />
                    </div>
                    <h4 className="font-semibold text-sm mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}>{item.title}</h4>
                    <p className="text-[13px] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", color: "#888" }}>{item.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Open roles listings */}
      {sections.listings !== false && (
        <section className="py-28 px-6 lg:px-14 max-w-[1440px] mx-auto">
          <Reveal>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 900, color: "#111", letterSpacing: "-0.02em" }} className="mb-8">
              {sections.listings?.title || "Open Positions"}
            </h2>
          </Reveal>
          {jobs.length === 0 ? (
            <p className="text-sm text-gray-400">No open positions at this time. Check back later!</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-10">
                {departments.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveDept(f)}
                    className="px-4 py-2 rounded-full text-[12px] font-semibold transition-all duration-200 cursor-pointer"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      background: activeDept === f ? "#111" : "#F7F7F7",
                      color: activeDept === f ? "#fff" : "#888"
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                {filteredJobs.map((job, i) => (
                  <Reveal key={job.id || i} delay={i * 0.07}>
                    <div
                      className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-2xl border transition-all duration-250 hover:border-[#C8A96B33] hover:bg-[#FFFDF8] cursor-pointer group"
                      style={{ borderColor: "#EBEBEB" }}
                      onClick={() => {
                        navigate(`/careers/${job.id}`);
                        window.scrollTo({ top: 0, behavior: "instant" });
                      }}
                    >
                      <div>
                        <h4 className="font-semibold text-[15px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}>{job.title}</h4>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[12px]" style={{ fontFamily: "'Inter', sans-serif", color: "#bbb" }}>{job.department}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span className="text-[12px]" style={{ fontFamily: "'Inter', sans-serif", color: "#bbb" }}>{job.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-4 md:mt-0">
                        <span className="px-3 py-1 rounded-full text-[11px]" style={{ fontFamily: "'Inter', sans-serif", background: "#F7F7F7", color: "#999" }}>{job.type}</span>
                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-semibold transition-all cursor-pointer" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#111", color: "#fff" }}>
                          Apply <ArrowRight size={11} />
                        </button>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}
