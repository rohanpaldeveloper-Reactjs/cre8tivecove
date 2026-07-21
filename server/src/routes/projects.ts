import { Router, Response } from "express";
import prisma from "../db.js";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

// GET /
router.get("/", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" }
    });
    return res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ error: "Server error fetching projects" });
  }
});

// GET /:slug
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { slug }
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.json(project);
  } catch (error) {
    console.error(`Error fetching project ${slug}:`, error);
    return res.status(500).json({ error: "Server error fetching project details" });
  }
});

// POST / [Admin Protected]
router.post("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const {
    title, slug, category, thumbnailUrl, previewVideoUrl,
    overview, challenge, solution, processSteps, results,
    gallery, clientFeedback, clientName, clientRole, clientAvatar,
    order, isFeatured
  } = req.body;

  if (!title || !slug || !category || !thumbnailUrl || !overview) {
    return res.status(400).json({
      error: "Title, slug, category, thumbnailUrl, and overview are required"
    });
  }

  try {
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      return res.status(400).json({ error: "A project with this slug already exists" });
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        category,
        thumbnailUrl,
        previewVideoUrl: previewVideoUrl || null,
        overview,
        challenge: challenge || "",
        solution: solution || "",
        processSteps: processSteps || [],
        results: results || [],
        gallery: gallery || [],
        clientFeedback: clientFeedback || null,
        clientName: clientName || null,
        clientRole: clientRole || null,
        clientAvatar: clientAvatar || null,
        order: order !== undefined ? parseInt(order) : 0,
        isFeatured: !!isFeatured
      }
    });

    return res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ error: "Server error creating project" });
  }
});

// PUT /:id [Admin Protected]
router.put("/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const {
    title, slug, category, thumbnailUrl, previewVideoUrl,
    overview, challenge, solution, processSteps, results,
    gallery, clientFeedback, clientName, clientRole, clientAvatar,
    order, isFeatured
  } = req.body;

  try {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check slug collision if changing slug
    if (slug && slug !== existing.slug) {
      const collision = await prisma.project.findUnique({ where: { slug } });
      if (collision) {
        return res.status(400).json({ error: "A project with this slug already exists" });
      }
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        slug: slug !== undefined ? slug : existing.slug,
        category: category !== undefined ? category : existing.category,
        thumbnailUrl: thumbnailUrl !== undefined ? thumbnailUrl : existing.thumbnailUrl,
        previewVideoUrl: previewVideoUrl !== undefined ? previewVideoUrl : existing.previewVideoUrl,
        overview: overview !== undefined ? overview : existing.overview,
        challenge: challenge !== undefined ? challenge : existing.challenge,
        solution: solution !== undefined ? solution : existing.solution,
        processSteps: processSteps !== undefined ? processSteps : existing.processSteps,
        results: results !== undefined ? results : existing.results,
        gallery: gallery !== undefined ? gallery : existing.gallery,
        clientFeedback: clientFeedback !== undefined ? clientFeedback : existing.clientFeedback,
        clientName: clientName !== undefined ? clientName : existing.clientName,
        clientRole: clientRole !== undefined ? clientRole : existing.clientRole,
        clientAvatar: clientAvatar !== undefined ? clientAvatar : existing.clientAvatar,
        order: order !== undefined ? parseInt(order) : existing.order,
        isFeatured: isFeatured !== undefined ? !!isFeatured : existing.isFeatured
      }
    });

    return res.json(updated);
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({ error: "Server error updating project" });
  }
});

// DELETE /:id [Admin Protected]
router.delete("/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    await prisma.project.delete({ where: { id } });
    return res.json({ message: "Project successfully deleted" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({ error: "Server error deleting project" });
  }
});

export default router;
