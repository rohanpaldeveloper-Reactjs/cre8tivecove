import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import { ChevronRight, Check, ArrowRight } from "lucide-react";
import { Reveal } from "../../components/public/Reveal.js";
import { api } from "../../api/client.js";

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    async function loadJobDetails() {
      setLoading(true);
      try {
        const data = await api.get(`/jobs/${id}`);
        setJob(data);
        if (data?.title) {
          document.title = `${data.title} | Cre8tiveCove Careers`;
        }
      } catch (err) {
        console.error("Failed to load job details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadJobDetails();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);

    if (!selectedFile) {
      setErrorMsg("Resume file is required");
      return;
    }

    formData.set("resume", selectedFile);
    setSubmitting(true);

    try {
      // POST multipart/form-data to apply endpoint
      await api.post(`/jobs/${id}/apply`, formData);
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to submit application. Make sure the file is a PDF/Word doc and under 10MB.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-[76px] min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="pt-[76px] min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Job Posting Not Found</h2>
        <Link to="/careers" className="text-sm text-[#C8A96B] hover:underline">Back to all positions</Link>
      </div>
    );
  }

  const responsibilities = Array.isArray(job.responsibilities) ? job.responsibilities : [];
  const requirements = Array.isArray(job.requirements) ? job.requirements : [];
  const benefits = Array.isArray(job.benefits) ? job.benefits : [];

  return (
    <div className="pt-[76px]">
      <div className="max-w-[860px] mx-auto px-6 lg:px-12 py-20">
        <Link
          to="/careers"
          className="flex items-center gap-2 text-[12px] font-semibold mb-14 hover:gap-3 transition-all text-gray-400"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <ChevronRight size={13} style={{ transform: "rotate(180deg)" }} /> Back to Careers
        </Link>

        <Reveal>
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1.5 rounded-full text-[11px] font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "rgba(200,169,107,0.12)", color: "#C8A96B" }}>
              {job.department}
            </span>
            <span className="text-[12px]" style={{ fontFamily: "'Inter', sans-serif", color: "#bbb" }}>{job.type} · {job.location}</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#111", lineHeight: 1.1, letterSpacing: "-0.02em" }} className="mb-14">
            {job.title}
          </h1>
        </Reveal>

        {/* Dynamic section blocks */}
        <Reveal>
          <div className="mb-12 pb-12 border-b border-gray-100">
            <h3 className="text-lg font-bold mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}>About the Role</h3>
            <p className="text-[15px] leading-[1.9] text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
              {job.overview}
            </p>
          </div>
        </Reveal>

        {responsibilities.length > 0 && (
          <Reveal>
            <div className="mb-12 pb-12 border-b border-gray-100">
              <h3 className="text-lg font-bold mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}>Responsibilities</h3>
              <ul className="flex flex-col gap-3.5">
                {responsibilities.map((item: string) => (
                  <li key={item} className="flex items-start gap-3 text-[14px] text-gray-600" style={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>
                    <Check size={14} style={{ color: "#C8A96B", marginTop: 4, flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}

        {requirements.length > 0 && (
          <Reveal>
            <div className="mb-12 pb-12 border-b border-gray-100">
              <h3 className="text-lg font-bold mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}>Requirements</h3>
              <ul className="flex flex-col gap-3.5">
                {requirements.map((item: string) => (
                  <li key={item} className="flex items-start gap-3 text-[14px] text-gray-600" style={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>
                    <Check size={14} style={{ color: "#C8A96B", marginTop: 4, flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}

        {benefits.length > 0 && (
          <Reveal>
            <div className="mb-12 pb-12 border-b border-gray-100">
              <h3 className="text-lg font-bold mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}>Benefits & Perks</h3>
              <ul className="flex flex-col gap-3.5">
                {benefits.map((item: string) => (
                  <li key={item} className="flex items-start gap-3 text-[14px] text-gray-600" style={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>
                    <Check size={14} style={{ color: "#C8A96B", marginTop: 4, flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}

        {/* Application form */}
        <Reveal>
          <div className="mt-4 p-8 rounded-2xl" id="apply-form" style={{ background: "#F7F7F7" }}>
            <h3 className="text-lg font-bold mb-7" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}>
              {submitted ? "Application Received" : "Apply for this Role"}
            </h3>
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(200,169,107,0.12)" }}>
                  <Check size={22} style={{ color: "#C8A96B" }} />
                </div>
                <p className="text-sm" style={{ fontFamily: "'Inter', sans-serif", color: "#888" }}>
                  We&apos;ll review your application and be in touch within 5 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.12em] block mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#bbb" }}>Full Name</label>
                    <input name="name" required placeholder="Full Name" className="w-full px-4 py-3.5 rounded-xl text-[13px] border border-gray-200 bg-white outline-none focus:border-[#C8A96B] transition-colors" style={{ fontFamily: "'Inter', sans-serif", color: "#111" }} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.12em] block mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#bbb" }}>Email Address</label>
                    <input type="email" name="email" required placeholder="Email Address" className="w-full px-4 py-3.5 rounded-xl text-[13px] border border-gray-200 bg-white outline-none focus:border-[#C8A96B] transition-colors" style={{ fontFamily: "'Inter', sans-serif", color: "#111" }} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.12em] block mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#bbb" }}>Phone Number</label>
                    <input name="phone" placeholder="Phone Number" className="w-full px-4 py-3.5 rounded-xl text-[13px] border border-gray-200 bg-white outline-none focus:border-[#C8A96B] transition-colors" style={{ fontFamily: "'Inter', sans-serif", color: "#111" }} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.12em] block mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#bbb" }}>Upload Resume (PDF, DOCX)</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-4 py-3.5 rounded-xl text-[13px] border border-dashed border-gray-200 bg-white text-center cursor-pointer hover:border-[#C8A96B] transition-colors flex items-center justify-center text-gray-500 font-medium"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {selectedFile ? selectedFile.name : "Select File (Max 10MB)"}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.12em] block mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#bbb" }}>Why Cre8tiveCove?</label>
                  <textarea name="coverNote" required rows={4} placeholder="Tell us what draws you to this role and studio..." className="w-full px-4 py-3.5 rounded-xl text-[13px] border border-gray-200 bg-white outline-none focus:border-[#C8A96B] transition-colors resize-none" style={{ fontFamily: "'Inter', sans-serif", color: "#111" }} />
                </div>
                {errorMsg && (
                  <p className="text-red-500 text-xs font-semibold">{errorMsg}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-7 py-3.5 rounded-full text-[13px] font-semibold transition-all hover:scale-[1.01] hover:shadow-lg cursor-pointer bg-[#111] text-white disabled:bg-gray-400"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {submitting ? "Submitting Application..." : "Submit Application"}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>

      {/* Sticky apply */}
      {!submitted && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-2 px-5 py-3 rounded-full text-[12px] font-semibold shadow-2xl shadow-black/15 transition-all hover:scale-105 cursor-pointer"
            style={{ background: "#C8A96B", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Apply Now <ArrowRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
