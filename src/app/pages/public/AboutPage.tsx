import { useState, useEffect } from "react";
import { Award, Target, Eye } from "lucide-react";
import { Reveal } from "../../components/public/Reveal.js";
import { api } from "../../api/client.js";
import * as Icons from "lucide-react";

function DynamicIcon({ name, size, className, style }: { name: string; size?: number; className?: string; style?: any }) {
  const IconComponent = (Icons as any)[name] || Icons.Award;
  return <IconComponent size={size} className={className} style={style} />;
}

const FALLBACK_HERO = {
  badge: "About Us",
  title: "Filmmakers, Designers & Digital Creators.",
  image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1800&h=900&fit=crop&auto=format"
};

const FALLBACK_STORY = {
  badge: "Our Story",
  title: "Born from a love of storytelling.",
  paragraphs: [
    "Founded in 2016 in Los Angeles, Cre8tiveCove began as a two-person team with a single camera and an outsized belief: every brand has a story worth telling beautifully. Over eight years, we've grown into a full-spectrum creative studio of 24 specialists across film, design, and digital.",
    "We've partnered with Fortune 500 corporations, funded startups, luxury hospitality brands, and nonprofits. The obsessive attention to craft that earned us our reputation has never changed."
  ]
};

const FALLBACK_MISSION_VISION = {
  items: [
    { label: "Mission", icon: "Target", text: "To translate every brand's truest vision into cinematic, strategic creative work that connects and converts — regardless of scale or industry." },
    { label: "Vision", icon: "Eye", text: "A world where every ambitious brand has access to world-class creative production and storytelling that shifts culture." }
  ]
};

const FALLBACK_RECOGNITION = {
  badge: "Recognition",
  awards: [
    { award: "Awwwards", detail: "SOTD × 12" },
    { award: "Cannes Lions", detail: "Gold 2023" },
    { award: "Webby Awards", detail: "Best Video" },
    { award: "D&AD", detail: "Wood Pencil" }
  ]
};

export default function AboutPage() {
  const [sections, setSections] = useState<Record<string, any>>({});
  const [team, setTeam] = useState<any[]>([]);

  useEffect(() => {
    document.title = "About Us | Cre8tiveCove";
    async function loadData() {
      try {
        const pageData = await api.get("/content/pages/about");
        const mapped = pageData.sections.reduce((acc: any, sec: any) => {
          if (sec.isVisible) acc[sec.key] = sec.content;
          return acc;
        }, {});
        setSections(mapped);
      } catch (err) {
        console.warn("Using local fallback for About page sections:", err);
      }

      try {
        const allTeam = await api.get("/team");
        setTeam(allTeam);
      } catch (err) {
        console.error("Failed to load team members:", err);
      }
    }
    loadData();
  }, []);

  const hero = sections.hero || FALLBACK_HERO;
  const story = sections.story || FALLBACK_STORY;
  const missionVision = sections.mission_vision || FALLBACK_MISSION_VISION;
  const recognition = sections.recognition || FALLBACK_RECOGNITION;

  return (
    <div className="pt-[76px]">
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-end overflow-hidden">
        <img
          src={hero.image}
          alt="Cre8tiveCove team"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)" }} />
        <div className="relative z-10 px-6 lg:px-14 pb-24 max-w-[1440px] mx-auto w-full">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>
              {hero.badge || "About Us"}
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 6vw, 5.5rem)", fontWeight: 900, color: "#fff", lineHeight: 1.04, letterSpacing: "-0.025em", maxWidth: "800px" }}>
              {hero.title?.includes("Creators") ? (
                <>
                  {hero.title.split("Creators")[0]}
                  <em style={{ fontStyle: "italic" }}>Creators.</em>
                </>
              ) : (
                hero.title || "Filmmakers, Designers & Digital Creators."
              )}
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      {sections.story !== false && (
        <section className="py-32 px-6 lg:px-14 max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>
                  {story.badge || "Our Story"}
                </p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 900, color: "#111", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                  {story.title?.includes("storytelling") ? (
                    <>
                      {story.title.split("storytelling")[0]}
                      <em style={{ fontStyle: "italic" }}>storytelling.</em>
                    </>
                  ) : (
                    story.title || "Born from a love of storytelling."
                  )}
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal delay={0.15}>
                {story.paragraphs?.map((p: string, i: number) => (
                  <p key={i} className="text-[15px] leading-[1.9] mb-6 last:mb-0" style={{ fontFamily: "'Inter', sans-serif", color: "#666" }}>
                    {p}
                  </p>
                ))}
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* Mission / Vision */}
      {sections.mission_vision !== false && (
        <section style={{ background: "#F7F7F7" }} className="py-20 px-6 lg:px-14">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
            {(missionVision.items || FALLBACK_MISSION_VISION.items).map((item: any) => (
              <Reveal key={item.label}>
                <div className="bg-white rounded-2xl p-10 h-full" style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.05)" }}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(200,169,107,0.1)" }}>
                      <DynamicIcon name={item.icon} size={18} style={{ color: "#C8A96B" }} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>
                      {item.label}
                    </span>
                  </div>
                  <p className="text-[15px] leading-[1.85]" style={{ fontFamily: "'Inter', sans-serif", color: "#666" }}>
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Team */}
      {sections.team !== false && team.length > 0 && (
        <section className="py-32 px-6 lg:px-14 max-w-[1440px] mx-auto">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>
              {sections.team?.badge || "The Team"}
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 900, color: "#111", lineHeight: 1.1, letterSpacing: "-0.02em" }} className="mb-16">
              {sections.team?.title || <>The people behind<br /><em style={{ fontStyle: "italic" }}>the work.</em></>}
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {team.map((m, i) => {
              const photoUrl = m.photoUrl.startsWith("http")
                ? m.photoUrl
                : `https://images.unsplash.com/photo-${m.photoUrl}?w=500&h=600&fit=crop&auto=format`;

              return (
                <Reveal key={m.id || i} delay={i * 0.09}>
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-2xl mb-4" style={{ height: 300, background: "#F7F7F7" }}>
                      <img
                        src={photoUrl}
                        alt={m.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                      />
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100" style={{ background: "rgba(200,169,107,0.12)" }} />
                    </div>
                    <h4 className="font-semibold text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}>{m.name}</h4>
                    <p className="text-[12px] mt-0.5" style={{ fontFamily: "'Inter', sans-serif", color: "#aaa" }}>{m.role}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* Awards */}
      {sections.recognition !== false && (
        <section style={{ background: "#0D0D0D" }} className="py-20 px-6 lg:px-14">
          <div className="max-w-[1440px] mx-auto">
            <Reveal className="text-center mb-14">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>
                {recognition.badge || "Recognition"}
              </p>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(recognition.awards || FALLBACK_RECOGNITION.awards).map((item: any) => (
                <Reveal key={item.award}>
                  <div className="text-center py-8 px-4 rounded-2xl border border-white/[0.07] hover:border-[#C8A96B44] transition-colors duration-300 group">
                    <Award size={20} className="mx-auto mb-3 transition-colors duration-200" style={{ color: "#C8A96B" }} />
                    <p className="font-semibold text-sm text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.award}</p>
                    <p className="text-[11px] mt-1" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.35)" }}>{item.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
