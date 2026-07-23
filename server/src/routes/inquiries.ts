import { Router, Response } from "express";
import prisma from "../db.js";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth.js";
import { emailService } from "../services/email.js";

const router = Router();

// PUBLIC: POST / (Submit inquiry)
router.post("/", async (req, res) => {
  const { name, company, service, budget, message } = req.body;

  if (!name || !service || !message) {
    return res.status(400).json({ error: "Name, service, and message are required" });
  }

  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        company: company || null,
        service,
        budget: budget || null,
        message
      }
    });

    console.log(`[Sales Alert] New client inquiry received from ${name} for ${service}. Budget: ${budget || "Not Specified"}`);

    // Send email alert to hello@cre8tivecove.com asynchronously (non-blocking)
    emailService.sendInquiryEmail(inquiry).catch((err) => {
      console.error("[Email Service Alert Error] Failed to send client inquiry email:", err);
    });

    return res.status(201).json(inquiry);
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return res.status(500).json({ error: "Server error submitting inquiry" });
  }
});

// ADMIN: GET / (List inquiries)
router.get("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.query;
  const where: any = {};

  if (status) {
    where.status = String(status);
  }

  try {
    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { submittedAt: "desc" }
    });
    return res.json(inquiries);
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return res.status(500).json({ error: "Server error fetching inquiries" });
  }
});

// ADMIN: PUT /:id/status (Update inquiry status)
router.put("/:id/status", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  if (status !== "NEW" && status !== "CONTACTED" && status !== "CLOSED") {
    return res.status(400).json({ error: "Invalid status value. Allowed: NEW, CONTACTED, CLOSED" });
  }

  try {
    const existing = await prisma.inquiry.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Inquiry not found" });
    }

    const updated = await prisma.inquiry.update({
      where: { id },
      data: { status }
    });

    return res.json(updated);
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    return res.status(500).json({ error: "Server error updating inquiry status" });
  }
});

// ADMIN: DELETE /:id (Delete inquiry)
router.delete("/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const existing = await prisma.inquiry.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Inquiry not found" });
    }

    await prisma.inquiry.delete({ where: { id } });
    return res.json({ message: "Inquiry successfully deleted" });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return res.status(500).json({ error: "Server error deleting inquiry" });
  }
});

export default router;
