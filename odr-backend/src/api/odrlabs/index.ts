import { Router } from "express";
import { authenticateJWT } from "../../middleware/auth";
import prisma from "../../lib/prisma";
import { AuthRequest } from "../../types/auth";

const router = Router();
router.use(authenticateJWT);

// GET /odrlabs/ideas - List all approved ideas for ODR Lab page
router.get("/ideas", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.userRole;
    const isAdmin = userRole === "ADMIN";

    const ideas = await prisma.idea.findMany({
      where: isAdmin
        ? { approved: true } // Admin sees all
        : {
            approved: true,
            OR: [
              { visibility: "PUBLIC" },        // All public ideas
              { ownerId: userId },             // Ideas owned by current user
              { 
                AND: [
                  { visibility: "PRIVATE" },
                  {
                    OR: [
                      { collaborators: { some: { userId } } }, // collaborator
                      { mentors: { some: { userId } } }        // mentor
                    ]
                  }
                ]
              }
            ],
          },
      orderBy: { createdAt: "desc" },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
            country: true,
          },
        },
        likes: true,
        comments: true,
        collaborators: { include: { user: { select: { id: true, name: true } } } },
        mentors: { include: { user: { select: { id: true, name: true } } } },
      },
    });

    const result = ideas.map((idea: any) => ({
      id: idea.id,
      name: idea.owner?.name || "Anonymous",
      email: idea.owner?.email || "",
      country: idea.owner?.country || "India",
      title: idea.title,
      caption: idea.caption || "",
      description: idea.description,
      submittedAt: idea.createdAt.toISOString(),
      likes: idea.likes.length,
      commentCount: idea.comments.length,
      isIdeaOwner: idea.ownerId === userId,
      collaborators: idea.collaborators.map((c: any) => c.user.name),
      mentors: idea.mentors.map((m: any) => m.user.name),
    }));

    res.json({ ideas: result });
  } catch (err) {
    console.error("Error fetching ideas:", err);
    res.status(500).json({ error: "Failed to fetch ideas" });
  }
});

export default router;
