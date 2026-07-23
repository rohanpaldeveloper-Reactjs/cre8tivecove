import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ChevronRight, Check, Plus, Minus, Mail, ArrowRight, Film } from "lucide-react";
import { Reveal } from "../../components/public/Reveal.js";
import { api } from "../../api/client.js";

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [relatedProjects, setRelatedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function loadService() {
      setLoading(true);
      try {
        const data = await api.get(`/services/${slug}`);
        setService(data);
        if (data?.title) {
          document.title = `${data.title} | Cre8tiveCove Services`;
        }

        // Fetch related projects
        try {
          const allProjects = await api.get("/projects");
          setRelatedProjects(allProjects.slice(0, 3));
        } catch (e) {
          console.warn("Could not fetch related projects", e);
        }
      } catch (err) {
        console.error("Failed to load service details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadService();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-[76px] min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="pt-[76px] min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Service Not Found</h2>
        <Link to="/services" className="text-sm text-[#C8A96B] hover:underline">Back to all services</Link>
      </div>
    );
  }

  // Handle image vs unsplash id fallback
  const heroImage = service.heroVideoUrl?.startsWith("http")
    ? service.heroVideoUrl
    : service.heroVideoUrl
      ? `https://images.unsplash.com/photo-${service.heroVideoUrl}?w=1800&h=800&fit=crop&auto=format`
      : "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1800&h=800&fit=crop&auto=format";

  const processList = Array.isArray(service.process) ? service.process : [];
  const deliverablesList = Array.isArray(service.deliverables) ? service.deliverables : [];
  const faqsList = Array.isArray(service.faqs) ? service.faqs : [];

  return (
    <div className="pt-[76px]">
      {/* Hero banner */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src={heroImage}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
        <div className="absolute inset-0 flex items-end">
          <div className="px-6 lg:px-14 pb-16 max-w-[1440px] mx-auto w-full">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>Service</p>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 900, color: "#fff", lineHeight: 1.06, letterSpacing: "-0.025em" }}>
                {service.title}
              </h1>
            </Reveal>
          </div>
        </div>
        <Link
          to="/services"
          className="absolute top-24 left-6 lg:left-14 flex items-center gap-2 text-[12px] font-semibold text-white/60 hover:text-white transition-colors"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <ChevronRight size={14} style={{ transform: "rotate(180deg)" }} /> Back to Services
        </Link>
      </section>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-14">
        {/* Overview */}
        <section className="py-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.25rem", fontWeight: 900, color: "#111", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                Service Overview
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.15}>
              <p className="text-[15px] leading-[1.9] mb-5 whitespace-pre-line" style={{ fontFamily: "'Inter', sans-serif", color: "#666" }} dangerouslySetInnerHTML={{ __html: service.overview || service.shortDescription }} />
              <div className="flex flex-wrap gap-3 mt-8">
                {processList.map((step: any) => (
                  <span key={step.title} className="px-4 py-2 rounded-full text-[12px] font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#F7F7F7", color: "#666" }}>
                    {step.title}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Deliverables */}
        {deliverablesList.length > 0 && (
          <section className="py-16 border-t border-gray-100">
            <Reveal>
              <h3 className="text-xl font-bold mb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}>What You Receive</h3>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deliverablesList.map(({ label, desc }: any) => (
                <Reveal key={label}>
                  <div className="p-6 rounded-xl" style={{ background: "#F7F7F7" }}>
                    <Check size={15} style={{ color: "#C8A96B", marginBottom: 12 }} />
                    <h4 className="font-semibold text-sm mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}>{label}</h4>
                    <p className="text-[12px]" style={{ fontFamily: "'Inter', sans-serif", color: "#999" }}>{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Process Steps */}
        {processList.length > 0 && (
          <section className="py-16 border-t border-gray-100">
            <Reveal>
              <h3 className="text-xl font-bold mb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}>Engagement Process</h3>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {processList.map((step: any, idx: number) => (
                <Reveal key={step.title} delay={idx * 0.1}>
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#C8A96B15] text-[#C8A96B] font-bold text-xs flex-shrink-0" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#111] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{step.title}</h4>
                      <p className="text-[13px] leading-relaxed text-[#666]" style={{ fontFamily: "'Inter', sans-serif" }}>{step.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* FAQs */}
        {faqsList.length > 0 && (
          <section className="py-16 border-t border-gray-100 mb-8">
            <Reveal>
              <h3 className="text-xl font-bold mb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}>Frequently Asked</h3>
            </Reveal>
            <div className="flex flex-col gap-3 max-w-2xl">
              {faqsList.map((faq: any, i: number) => (
                <Reveal key={i} delay={i * 0.07}>
                  <div className="rounded-2xl border overflow-hidden transition-all duration-200 hover:border-[#C8A96B44]" style={{ borderColor: "#eee" }}>
                    <button
                      className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="text-sm font-semibold pr-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}>{faq.q}</span>
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
                        style={{ background: openFaq === i ? "#C8A96B" : "#F7F7F7" }}
                      >
                        {openFaq === i ? <Minus size={13} className="text-white" /> : <Plus size={13} style={{ color: "#888" }} />}
                      </div>
                    </button>
                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{ maxHeight: openFaq === i ? "120px" : "0" }}
                    >
                      <p className="px-6 pb-5 text-[13px] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", color: "#777" }}>{faq.a}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Related Projects Showcase */}
        {relatedProjects.length > 0 && (
          <section className="py-16 border-t border-gray-100 mb-12">
            <Reveal>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#C8A96B] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Portfolio</p>
                  <h3 className="text-2xl font-bold text-[#111]" style={{ fontFamily: "'Playfair Display', serif" }}>Featured Work in Action</h3>
                </div>
                <Link to="/work" className="text-xs font-semibold text-gray-500 hover:text-black flex items-center gap-1">
                  View All Portfolio <ArrowRight size={12} />
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((p) => (
                <Reveal key={p.id}>
                  <div
                    onClick={() => {
                      navigate(`/work/${p.slug}`);
                      window.scrollTo({ top: 0, behavior: "instant" });
                    }}
                    className="group cursor-pointer rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={p.thumbnailUrl}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md text-white">
                        {p.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#C8A96B] transition-colors mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {p.title}
                      </h4>
                      <p className="text-[12px] text-gray-500 line-clamp-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {p.overview}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Contact CTA */}
      <section className="mx-4 lg:mx-14 mb-20 rounded-3xl overflow-hidden" style={{ background: "#111" }}>
        <div className="px-8 lg:px-16 py-16 text-center relative">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(200,169,107,0.12) 0%, transparent 60%)" }} />
          <Reveal>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.02em" }} className="mb-6">
              Interested in {service.title}?
            </h3>
            <button
              onClick={() => navigate("/contact")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[13px] font-semibold transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{ background: "#C8A96B", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Start a Conversation <ArrowRight size={13} />
            </button>
          </Reveal>
        </div>
      </section>

      {/* Sticky inquiry */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => navigate("/contact", { state: { service: service.title } })}
          className="flex items-center gap-2 px-5 py-3 rounded-full text-[12px] font-semibold shadow-2xl shadow-black/20 transition-all hover:scale-105 cursor-pointer"
          style={{ background: "#C8A96B", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <Mail size={13} /> Get a Quote
        </button>
      </div>
    </div>
  );
}
