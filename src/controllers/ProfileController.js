import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const routes = {
  store: async (req, res) => {
    if (!req.body.bio) {
      return res.json(400).json({ errors: ["bio field must be sent."] });
    }
    try {
      const findProfile = await prisma.profile.findUnique({
        where: { userId: Number(req.userId) },
      });

      // If there's alredy a profile, in this line it will be updated.
      if (findProfile) {
        return routes.update(req, res);
      }

      const profile = await prisma.profile.create({
        data: {
          bio: req.body.bio,
          userId: req.userId,
        },
      });

      return res.json(profile);
    } catch (error) {
      return res
        .status(500)
        .json({ error: ["Unexpected error has occurred. Please, try again."] });
    }
  },
  update: async (req, res) => {
    try {
      const findProfile = await prisma.profile.findUnique({
        where: { userId: Number(req.userId) },
      });

      // If there's no profile, in this line it will be created.
      if (!findProfile) {
        return routes.store(req, res);
      }

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
      return res
        .status(500)
        .json({ error: ["Unexpected error has occurred. Please, try again."] });
    }
  },
  delete: async (req, res) => {
    try {
      const findProfile = await prisma.profile.findUnique({
        where: { userId: Number(req.userId) },
      });

      if (!findProfile) {
        return res.status(404).json({ errors: ["User Profile not found."] });
      }

      const profile = await prisma.profile.delete({
        where: {
          userId: Number(req.userId),
        },
      });

      return res.json(profile);
    } catch (error) {
      return res
        .status(500)
        .json({ error: ["Unexpected error has occurred. Please, try again."] });
    }
  },
};

export default routes;
