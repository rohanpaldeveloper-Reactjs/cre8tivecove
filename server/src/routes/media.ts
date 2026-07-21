import { Router, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import prisma from "../db.js";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

// Configure storage for media files (images/videos)
const uploadDir = path.resolve("public/uploads/media");
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
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".mp4", ".mov", ".webm"];
    if (!allowed.includes(ext)) {
      return cb(new Error("Only images (PNG, JPG, JPEG, WEBP, GIF) and videos (MP4, MOV, WEBM) are allowed"));
    }
    cb(null, true);
  }
});

// ADMIN: GET / (List all media items)
router.get("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: "desc" }
    });
    return res.json(media);
  } catch (error) {
    console.error("Error fetching media:", error);
    return res.status(500).json({ error: "Server error fetching media library" });
  }
});

// ADMIN: POST / (Upload media file)
router.post("/", authenticateToken, upload.single("file"), async (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file was uploaded" });
  }

  const { altText } = req.body;
  const filename = req.file.filename;
  const url = `/uploads/media/${filename}`;

  // Determine type: image or video
  const ext = path.extname(filename).toLowerCase();
  const videoExts = [".mp4", ".mov", ".webm"];
  const type = videoExts.includes(ext) ? "video" : "image";

  try {
    const media = await prisma.media.create({
      data: {
        url,
        filename,
        type,
        altText: altText || null,
        uploadedBy: req.user?.email || "Admin"
      }
    });

    return res.status(201).json(media);
  } catch (error) {
    console.error("Error saving media entry to DB:", error);
    return res.status(500).json({ error: "Server error saving media metadata" });
  }
});

// ADMIN: DELETE /:id (Delete media file and DB record)
router.delete("/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return res.status(404).json({ error: "Media item not found" });
    }

    // Try deleting file from disk
    const filePath = path.join(uploadDir, media.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Failed to delete file from disk: ${filePath}`, err);
      }
    }

    await prisma.media.delete({ where: { id } });
    return res.json({ message: "Media successfully deleted" });
  } catch (error) {
    console.error("Error deleting media:", error);
    return res.status(500).json({ error: "Server error deleting media" });
  }
});

export default router;
