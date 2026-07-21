import { Router, Response } from "express";
import prisma from "../db.js";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

// GET /pages/:slug
router.get("/pages/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const page = await prisma.page.findUnique({
      where: { slug },
      include: {
        sections: {
          orderBy: { order: "asc" }
        }
      }
    });

    if (!page) {
      return res.status(404).json({ error: `Page with slug '${slug}' not found` });
    }

    return res.json(page);
  } catch (error) {
    console.error(`Error fetching page ${slug}:`, error);
    return res.status(500).json({ error: "Server error fetching page" });
  }
});

// PUT /pages/:slug [Admin Protected]
router.put("/pages/:slug", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { slug } = req.params;
  const { title, seoMeta, sections } = req.body;

  try {
    // 1. Find or create page
    let page = await prisma.page.findUnique({ where: { slug } });
    if (!page) {
      page = await prisma.page.create({
        data: {
          slug,
          title: title || slug,
          seoMeta: seoMeta || {},
        }
      });
    } else {
      page = await prisma.page.update({
        where: { slug },
        data: {
          title: title !== undefined ? title : page.title,
          seoMeta: seoMeta !== undefined ? seoMeta : page.seoMeta,
        }
      });
    }

    // 2. If sections are provided, upsert/update them
    if (Array.isArray(sections)) {
      for (const sec of sections) {
        if (!sec.key) continue;

        // Upsert section by key and pageId
        // Prisma doesn't have a direct composite unique on pageId + key unless we define it,
        // so we'll look up by pageId + key first.
        const existingSection = await prisma.section.findFirst({
          where: { pageId: page.id, key: sec.key }
        });

        if (existingSection) {
          await prisma.section.update({
            where: { id: existingSection.id },
            data: {
              content: sec.content !== undefined ? sec.content : existingSection.content,
              order: sec.order !== undefined ? sec.order : existingSection.order,
              isVisible: sec.isVisible !== undefined ? sec.isVisible : existingSection.isVisible,
            }
          });
        } else {
          await prisma.section.create({
            data: {
              pageId: page.id,
              key: sec.key,
              order: sec.order || 0,
              content: sec.content || {},
              isVisible: sec.isVisible !== undefined ? sec.isVisible : true,
            }
          });
        }
      }
    }

    // Return the updated page with sections
    const updatedPage = await prisma.page.findUnique({
      where: { slug },
      include: {
        sections: { orderBy: { order: "asc" } }
      }
    });

    return res.json(updatedPage);
  } catch (error) {
    console.error(`Error updating page ${slug}:`, error);
    return res.status(500).json({ error: "Server error updating page" });
  }
});

// GET /settings
router.get("/settings", async (req, res) => {
  try {
    const settingsList = await prisma.siteSettings.findMany();
    // Convert array of [{key, value}] to a single object {key: value}
    const settings: Record<string, any> = {};
    for (const item of settingsList) {
      settings[item.key] = item.value;
    }
    return res.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return res.status(500).json({ error: "Server error fetching settings" });
  }
});

// PUT /settings [Admin Protected]
router.put("/settings", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const settingsData = req.body; // e.g. { office_address: "...", social_links: [...] }

  try {
    for (const key of Object.keys(settingsData)) {
      const value = settingsData[key];

      await prisma.siteSettings.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      });
    }

    // Return all updated settings
    const settingsList = await prisma.siteSettings.findMany();
    const settings: Record<string, any> = {};
    for (const item of settingsList) {
      settings[item.key] = item.value;
    }
    return res.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return res.status(500).json({ error: "Server error updating settings" });
  }
});

export default router;
