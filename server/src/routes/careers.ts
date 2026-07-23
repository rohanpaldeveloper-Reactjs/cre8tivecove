import { Router, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import prisma from "../db.js";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth.js";
import { emailService } from "../services/email.js";

const router = Router();

// Configure storage for resumes
const uploadDir = path.resolve("public/uploads/resumes");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".pdf" && ext !== ".doc" && ext !== ".docx") {
      return cb(new Error("Only PDF and Word documents are allowed"));
    }
    cb(null, true);
  }
});

// PUBLIC: GET /jobs (All open jobs)
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await prisma.jobPosting.findMany({
      where: { isOpen: true },
      orderBy: { postedAt: "desc" }
    });
    return res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ error: "Server error fetching jobs" });
  }
});

// PUBLIC: GET /jobs/:id (Job detail)
router.get("/jobs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const job = await prisma.jobPosting.findUnique({
      where: { id }
    });

    if (!job) {
      return res.status(404).json({ error: "Job posting not found" });
    }

    return res.json(job);
  } catch (error) {
    console.error(`Error fetching job ${id}:`, error);
    return res.status(500).json({ error: "Server error fetching job details" });
  }
});

// PUBLIC: POST /jobs/:id/apply (Submit job application)
router.post("/jobs/:id/apply", upload.single("resume"), async (req, res) => {
  const { id: jobPostingId } = req.params;
  const { name, email, phone, coverNote } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  if (!req.file) {
    return res.status(400).json({ error: "Resume file is required" });
  }

  try {
    const job = await prisma.jobPosting.findUnique({ where: { id: jobPostingId } });
    if (!job || !job.isOpen) {
      return res.status(404).json({ error: "Job posting is not open or does not exist" });
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;

    const application = await prisma.jobApplication.create({
      data: {
        jobPostingId,
        name,
        email,
        phone: phone || null,
        resumeUrl,
        coverNote: coverNote || null
      }
    });

    console.log(`[HR Alert] New job application received for role '${job.title}' from ${name} (${email})`);

    // Send email alert to hello@cre8tivecove.com asynchronously with the resume attachment
    const absoluteResumePath = req.file ? path.resolve(req.file.path) : null;
    emailService.sendJobApplicationEmail(application, job.title, absoluteResumePath).catch((err) => {
      console.error("[Email Service Alert Error] Failed to send job application email:", err);
    });

    return res.status(201).json(application);
  } catch (error) {
    console.error("Error submitting job application:", error);
    return res.status(500).json({ error: "Server error submitting application" });
  }
});

// ADMIN: GET /postings (All jobs, open or closed, with application counts)
router.get("/postings", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const jobs = await prisma.jobPosting.findMany({
      orderBy: { postedAt: "desc" },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });
    return res.json(jobs);
  } catch (error) {
    console.error("Error fetching job postings for admin:", error);
    return res.status(500).json({ error: "Server error fetching postings" });
  }
});

// ADMIN: POST /jobs (Create job posting)
router.post("/jobs", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { title, department, location, type, overview, responsibilities, requirements, benefits, isOpen } = req.body;

  if (!title || !department || !location || !type || !overview) {
    return res.status(400).json({ error: "Title, department, location, type, and overview are required" });
  }

  try {
    const job = await prisma.jobPosting.create({
      data: {
        title,
        department,
        location,
        type,
        overview,
        responsibilities: responsibilities || [],
        requirements: requirements || [],
        benefits: benefits || [],
        isOpen: isOpen !== undefined ? !!isOpen : true
      }
    });
    return res.status(201).json(job);
  } catch (error) {
    console.error("Error creating job posting:", error);
    return res.status(500).json({ error: "Server error creating job posting" });
  }
});

// ADMIN: PUT /jobs/:id (Update job posting)
router.put("/jobs/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { title, department, location, type, overview, responsibilities, requirements, benefits, isOpen } = req.body;

  try {
    const existing = await prisma.jobPosting.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Job posting not found" });
    }

    const updated = await prisma.jobPosting.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        department: department !== undefined ? department : existing.department,
        location: location !== undefined ? location : existing.location,
        type: type !== undefined ? type : existing.type,
        overview: overview !== undefined ? overview : existing.overview,
        responsibilities: responsibilities !== undefined ? responsibilities : existing.responsibilities,
        requirements: requirements !== undefined ? requirements : existing.requirements,
        benefits: benefits !== undefined ? benefits : existing.benefits,
        isOpen: isOpen !== undefined ? !!isOpen : existing.isOpen
      }
    });

    return res.json(updated);
  } catch (error) {
    console.error("Error updating job posting:", error);
    return res.status(500).json({ error: "Server error updating job posting" });
  }
});

// ADMIN: DELETE /jobs/:id (Delete job posting)
router.delete("/jobs/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const existing = await prisma.jobPosting.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Job posting not found" });
    }

    await prisma.jobPosting.delete({ where: { id } });
    return res.json({ message: "Job posting successfully deleted" });
  } catch (error) {
    console.error("Error deleting job posting:", error);
    return res.status(500).json({ error: "Server error deleting job posting" });
  }
});

// ADMIN: GET /applications (List applications)
router.get("/applications", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { jobPostingId } = req.query;
  const where: any = {};

  if (jobPostingId) {
    where.jobPostingId = String(jobPostingId);
  }

  try {
    const applications = await prisma.jobApplication.findMany({
      where,
      orderBy: { submittedAt: "desc" },
      include: {
        jobPosting: {
          select: { title: true, department: true }
        }
      }
    });
    return res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({ error: "Server error fetching applications" });
  }
});

export default router;
