import { Router, Response } from "express";
import prisma from "../db.js";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

// GET /
router.get("/", async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { order: "asc" }
    });
    return res.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return res.status(500).json({ error: "Server error fetching testimonials" });
  }
});

// POST / [Admin Protected]
router.post("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { clientName, clientPhoto, companyLogo, quote, rating, order } = req.body;

  if (!clientName || !quote) {
    return res.status(400).json({ error: "Client name and quote are required" });
  }

  try {
    const testimonial = await prisma.testimonial.create({
      data: {
        clientName,
        clientPhoto: clientPhoto || null,
        companyLogo: companyLogo || null,
        quote,
        rating: rating !== undefined ? parseInt(rating) : 5,
        order: order !== undefined ? parseInt(order) : 0
      }
    });
    return res.status(201).json(testimonial);
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return res.status(500).json({ error: "Server error creating testimonial" });
  }
});

// PUT /:id [Admin Protected]
router.put("/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { clientName, clientPhoto, companyLogo, quote, rating, order } = req.body;

  try {
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        clientName: clientName !== undefined ? clientName : existing.clientName,
        clientPhoto: clientPhoto !== undefined ? clientPhoto : existing.clientPhoto,
        companyLogo: companyLogo !== undefined ? companyLogo : existing.companyLogo,
        quote: quote !== undefined ? quote : existing.quote,
        rating: rating !== undefined ? parseInt(rating) : existing.rating,
        order: order !== undefined ? parseInt(order) : existing.order
      }
    });

    return res.json(updated);
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return res.status(500).json({ error: "Server error updating testimonial" });
  }
});

// DELETE /:id [Admin Protected]
router.delete("/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    await prisma.testimonial.delete({ where: { id } });
    return res.json({ message: "Testimonial successfully deleted" });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return res.status(500).json({ error: "Server error deleting testimonial" });
  }
});

export default router;
