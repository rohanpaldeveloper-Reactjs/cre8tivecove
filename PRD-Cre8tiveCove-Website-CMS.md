# Product Requirements Document (PRD)
## Cre8tiveCove — Premium Creative Agency Website + Headless CMS Admin Panel

**Version:** 1.0
**Date:** July 2026

---

## 1. Product Vision

A premium, editorial-style marketing website for a creative agency (video production, corporate films, commercial shoots, web/UI-UX design, branding, social content) — combined with a **custom CMS admin panel** that lets a non-technical team member edit the content of every section on every page (hero text, images, videos, testimonials, work samples, team members, job listings, etc.) without touching code.

This is effectively two products in one:
1. **Public website** — the Awwwards-grade, Apple/Linear/Notion-inspired experience described in the design brief.
2. **Admin CMS** — a JWT-authenticated dashboard where each editable region of the site is backed by a database record, manageable through structured forms.

---

## 2. Goals & Success Metrics

| Goal | Metric |
|---|---|
| Ship a premium, non-templated brand site | Passes internal design review against Awwwards-tier bar; Lighthouse performance ≥ 90 |
| Fully editable without a developer | 100% of visible text/images/videos across all pages manageable from admin panel |
| Fast content updates | Non-technical editor can update a section (e.g. hero headline, add a portfolio project) in under 2 minutes |
| SEO-ready | Server-rendered/pre-rendered meta tags, sitemap, structured data on Work/Service detail pages |
| Reliability | Admin content changes reflect on live site with no deploy required |

---

## 3. User Roles

| Role | Description |
|---|---|
| **Super Admin** | Full access — manage users, all content, site settings, media library |
| **Content Editor** (optional, phase 2) | Can edit/publish content but not manage users or global settings |
| **Site Visitor** | Public, unauthenticated — browses the marketing site, submits inquiry/job application forms |

v1 can ship with a single **Admin** role only; role separation (Editor vs Super Admin) is a clean Phase 2 addition once the data model already has an `role` field.

---

## 4. Site Map & Pages

| Page | Purpose |
|---|---|
| Home | Hero, Featured Work, Services, Why Choose Us, Testimonials, Behind the Scenes, CTA |
| About | Our Story, Mission & Vision, Team Showcase, Studio Culture, Awards |
| Services (listing) | Grid of all services with image + description + CTA |
| Service Detail | Per-service hero video, overview, process, deliverables, FAQs, related work |
| Our Work (portfolio listing) | Filterable project grid with hover-preview video |
| Work Detail (case study) | Overview, Challenge, Solution, Process, Results, Gallery, Client Feedback, Next Project |
| Careers (listing) | Open positions grid, filters, culture/benefits |
| Job Detail | Job overview, responsibilities, requirements, benefits, application form |
| Contact | Contact info, map, inquiry form |

Design/visual requirements (white luxury theme, editorial layout, large typography, hover video previews, scroll-reveal animation, micro-interactions) are treated as **frontend implementation requirements**, not backend scope — noted here for completeness but detailed separately in a design spec / Figma file, not duplicated in this PRD.

---

## 5. CMS / Editable Content Model

This is the core engineering deliverable beyond "just a marketing site." Every section listed below needs a matching database entity + admin form + public API endpoint.

### 5.1 Content Entities (Prisma models — high level)

```
User            → id, email, passwordHash, role, createdAt
Page            → id, slug (home/about/services/work/careers/contact), title, seoMeta(json)
Section         → id, pageId, key (e.g. "hero", "why_choose_us"), order, isVisible
HeroContent     → sectionId, headline, subheading, ctaPrimaryText, ctaPrimaryLink,
                   ctaSecondaryText, ctaSecondaryLink, videoUrl/imageUrl, stats(json[])
Service         → id, title, slug, shortDescription, icon/image, order, isFeatured
ServiceDetail   → serviceId, heroVideoUrl, overview, process(json[]), deliverables(json[]),
                   faqs(json[] of {q,a}), relatedProjectIds[]
Project         → id, title, slug, category, thumbnailUrl, previewVideoUrl,
                   overview, challenge, solution, processSteps(json[]), results(json[]),
                   gallery(Media[]), clientFeedback, order, isFeatured
TeamMember      → id, name, role, photoUrl, bio, order
Testimonial     → id, clientName, clientPhoto, companyLogo, quote, rating, order
JobPosting      → id, title, department, location, type, overview, responsibilities(json[]),
                   requirements(json[]), benefits(json[]), isOpen, postedAt
JobApplication  → id, jobPostingId, name, email, phone, resumeUrl, coverNote, submittedAt
Inquiry         → id, name, company, service, budget, message, submittedAt, status
Media           → id, url, type(image/video), altText, uploadedBy, createdAt
SiteSettings    → key/value store — office address, phone, email, social links, achievements
                   (500+ Projects, 100+ Clients, 8+ Years — editable counters)
```

### 5.2 Admin Panel Modules (mapped to pages)

| Admin Module | Manages |
|---|---|
| Dashboard | Recent inquiries, applications, quick stats |
| Home Page Editor | Hero, Featured Work selection, Why Choose Us timeline, CTA section text |
| Services Manager | CRUD services + service detail (process, deliverables, FAQs) |
| Portfolio Manager | CRUD projects/case studies, gallery uploads, category tagging, featured flag |
| Team Manager | CRUD team members (About page) |
| Testimonials Manager | CRUD testimonials |
| Careers Manager | CRUD job postings, view/export applications, mark open/closed |
| Inquiries | View/manage contact form submissions, mark status (new/contacted/closed) |
| Site Settings | Contact info, social links, achievement counters, SEO defaults |
| Media Library | Upload/manage images & videos, reuse across sections |
| User Management (Phase 2) | Manage admin/editor accounts |

Every module = standard CRUD (list, create, edit, delete, reorder where relevant) — this is a large but mechanically repetitive build, well suited to a shared generic CRUD scaffold on both frontend and backend rather than hand-building each one from scratch.

---

## 6. Authentication & Security

- JWT-based auth for the **admin panel only** — public site has no login.
- Access token (short-lived, ~15 min) + refresh token (httpOnly cookie) pattern to avoid storing long-lived tokens in localStorage.
- Passwords hashed with bcrypt/argon2.
- Role field on `User` (`SUPER_ADMIN`, `EDITOR`) even in v1, even if only one role is used initially — avoids a migration later.
- Rate limiting on login endpoint; audit log on content changes (who edited what, when) is a strongly recommended v1 addition given multiple people may eventually edit content.
- File upload validation (type/size limits) for media library and resume uploads.
- Public API endpoints (GET content) are read-only, cached; all write endpoints require valid JWT + role check.

---

## 7. Tech Architecture

**Frontend (public site):** React (Next.js recommended over plain Vite React here — you need SEO, meta tags per page, and ideally SSR/ISR for a marketing site that ranks on Google; plain client-rendered React is a real SEO handicap for an agency site). Tailwind CSS, Framer Motion for scroll-reveal/micro-interactions, next/image for optimized media.

**Admin Panel:** Separate React app (Vite is fine here — no SEO need), Tailwind, React Hook Form + Zod for form validation, TanStack Query for data fetching/caching.

**Backend:** Node.js + Express or NestJS, REST API, JWT auth (Passport.js or custom middleware).

**ORM/DB:** Prisma + PostgreSQL (as requested) — Prisma's schema-first approach is a good fit for this many structured content entities.

**Media Storage:** AWS S3 / Cloudflare R2 for images & videos, served via CDN (CloudFront/Cloudflare) — video hover-previews need CDN delivery for performance, not raw DB/server storage.

**Hosting:** Public site on Vercel (pairs naturally with Next.js) or a Node server behind Nginx; Admin panel + API on a standard VPS/AWS/Render setup; Postgres via managed RDS/Supabase/Neon.

**Email:** Transactional email (Resend/SendGrid) for contact form and job application notifications to the internal team.

---

## 8. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Lighthouse Performance ≥ 90, LCP < 2.5s despite video-heavy design (lazy-load below-fold video/images) |
| SEO | Server-rendered meta tags, Open Graph tags, sitemap.xml, robots.txt, structured data (JSON-LD) on Work/Service pages |
| Accessibility | Reasonable WCAG AA effort — alt text fields on all media, keyboard-navigable nav |
| Responsiveness | Mobile-first; hover-preview interactions need touch-friendly fallback on mobile |
| Content update latency | Admin edits reflect on live site within seconds (no rebuild/redeploy required — rules out a fully static-export approach in favor of ISR/on-demand revalidation if using Next.js) |

---

## 9. Out of Scope (v1)
- Multi-language content
- Editor role granularity beyond Super Admin / Editor
- Client portal / project tracking for actual clients
- Blog/CMS-style long-form articles (can be added later using the same Section pattern)
- E-commerce or payment functionality (not applicable here)

---

## 10. Open Questions
1. Next.js (better SEO/SSR) vs plain React/Vite (simpler, matches your original stack note) for the **public site** — SEO matters a lot for an agency that wants inbound leads, so this is worth deciding explicitly rather than defaulting.
2. Should job applications store resumes in S3 with links in the DB, or email them directly to HR and just log metadata?
3. Do you want scroll-reveal/micro-interaction animation timing/config to also be admin-editable, or hardcoded in the frontend (recommended — keeps CMS focused on content, not motion design)?
4. Single Admin role for v1, or do you already know you'll need multiple content editors from day one?

---

## 11. High-Level Timeline (indicative)

| Phase | Duration |
|---|---|
| Design finalization (Figma) + content model sign-off | 1–2 wks |
| Backend: Prisma schema, auth, CRUD APIs for all modules | 3–4 wks |
| Admin Panel UI (all modules) | 3–4 wks (overlaps backend) |
| Public site frontend build (all pages, animations) | 4–5 wks (overlaps backend) |
| Integration, content population, SEO setup | 1–2 wks |
| QA, performance tuning, launch | 1–2 wks |
| **Total** | **~10–13 weeks** |
