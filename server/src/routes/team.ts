import { Router, Response } from "express";
import prisma from "../db.js";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

// GET /
router.get("/", async (req, res) => {
  try {
    const team = await prisma.teamMember.findMany({
      orderBy: { order: "asc" }
    });
    return res.json(team);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return res.status(500).json({ error: "Server error fetching team" });
  }
});

// POST / [Admin Protected]
router.post("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { name, role, photoUrl, bio, order } = req.body;

  if (!name || !role || !photoUrl) {
    return res.status(400).json({ error: "Name, role, and photoUrl are required" });
  }

  try {
    const member = await prisma.teamMember.create({
      data: {
        name,
        role,
        photoUrl,
        bio: bio || null,
        order: order !== undefined ? parseInt(order) : 0
      }
    });
    return res.status(201).json(member);
  } catch (error) {
    console.error("Error creating team member:", error);
    return res.status(500).json({ error: "Server error creating team member" });
  }
});

// PUT /:id [Admin Protected]
router.put("/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, role, photoUrl, bio, order } = req.body;

  try {
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Team member not found" });
    }

    const updated = await prisma.teamMember.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existing.name,
        role: role !== undefined ? role : existing.role,
        photoUrl: photoUrl !== undefined ? photoUrl : existing.photoUrl,
        bio: bio !== undefined ? bio : existing.bio,
        order: order !== undefined ? parseInt(order) : existing.order
      }
    });

    return res.json(updated);
  } catch (error) {
    console.error("Error updating team member:", error);
    return res.status(500).json({ error: "Server error updating team member" });
  }
});

// DELETE /:id [Admin Protected]
router.delete("/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Team member not found" });
    }

    await prisma.teamMember.delete({ where: { id } });
    return res.json({ message: "Team member successfully deleted" });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return res.status(500).json({ error: "Server error deleting team member" });
  }
});

export default router;
