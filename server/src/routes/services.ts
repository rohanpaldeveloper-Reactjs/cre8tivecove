import { Router, Response } from "express";
import prisma from "../db.js";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

// GET /
router.get("/", async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: "asc" }
    });
    return res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({ error: "Server error fetching services" });
  }
});

// GET /:slug
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const service = await prisma.service.findUnique({
      where: { slug }
    });

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    return res.json(service);
  } catch (error) {
    console.error(`Error fetching service ${slug}:`, error);
    return res.status(500).json({ error: "Server error fetching service details" });
  }
});

// POST / [Admin Protected]
router.post("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const {
    title, slug, shortDescription, icon, order, isFeatured,
    heroVideoUrl, overview, process, deliverables, faqs
  } = req.body;

  if (!title || !slug || !shortDescription) {
    return res.status(400).json({ error: "Title, slug, and shortDescription are required" });
  }

  try {
    const existing = await prisma.service.findUnique({ where: { slug } });
    if (existing) {
      return res.status(400).json({ error: "A service with this slug already exists" });
    }

    const service = await prisma.service.create({
      data: {
        title,
        slug,
        shortDescription,
        icon: icon || "Film",
        order: order !== undefined ? parseInt(order) : 0,
        isFeatured: !!isFeatured,
        heroVideoUrl: heroVideoUrl || null,
        overview: overview || null,
        process: process || [],
        deliverables: deliverables || [],
        faqs: faqs || []
      }
    });

    return res.status(201).json(service);
  } catch (error) {
    console.error("Error creating service:", error);
    return res.status(500).json({ error: "Server error creating service" });
  }
});

// PUT /:id [Admin Protected]
router.put("/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const {
    title, slug, shortDescription, icon, order, isFeatured,
    heroVideoUrl, overview, process, deliverables, faqs
  } = req.body;

  try {
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Check slug collision if changing slug
    if (slug && slug !== existing.slug) {
      const collision = await prisma.service.findUnique({ where: { slug } });
      if (collision) {
        return res.status(400).json({ error: "A service with this slug already exists" });
      }
    }

    const updated = await prisma.service.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        slug: slug !== undefined ? slug : existing.slug,
        shortDescription: shortDescription !== undefined ? shortDescription : existing.shortDescription,
        icon: icon !== undefined ? icon : existing.icon,
        order: order !== undefined ? parseInt(order) : existing.order,
        isFeatured: isFeatured !== undefined ? !!isFeatured : existing.isFeatured,
        heroVideoUrl: heroVideoUrl !== undefined ? heroVideoUrl : existing.heroVideoUrl,
        overview: overview !== undefined ? overview : existing.overview,
        process: process !== undefined ? process : existing.process,
        deliverables: deliverables !== undefined ? deliverables : existing.deliverables,
        faqs: faqs !== undefined ? faqs : existing.faqs
      }
    });

    return res.json(updated);
  } catch (error) {
    console.error("Error updating service:", error);
    return res.status(500).json({ error: "Server error updating service" });
  }
});

// DELETE /:id [Admin Protected]
router.delete("/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    await prisma.service.delete({ where: { id } });
    return res.json({ message: "Service successfully deleted" });
  } catch (error) {
    console.error("Error deleting service:", error);
    return res.status(500).json({ error: "Server error deleting service" });
  }
});

export default router;
