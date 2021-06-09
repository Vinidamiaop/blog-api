import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const routes = {
  store: async (req, res) => {
    try {
      const profile = await prisma.profile.create({
        data: {
          bio: req.body.bio,
          userId: req.userId,
        },
      });

      return res.json(profile);
    } catch (error) {
      return res.status(400).json({ error: [error.message] });
    }
  },
  update: async (req, res) => {
    try {
      const profile = await prisma.profile.update({
        where: {
          userId: Number(req.userId),
        },
        data: {
          bio: req.body.bio,
        },
      });

      return res.json(profile);
    } catch (error) {
      return res.status(400).json({ error: [error.message] });
    }
  },
  delete: async (req, res) => {
    try {
      const profile = await prisma.profile.delete({
        where: {
          userId: Number(req.userId),
        },
      });

      return res.json(profile);
    } catch (error) {
      return res.status(400).json({ error: [error.message] });
    }
  },
};

export default routes;
