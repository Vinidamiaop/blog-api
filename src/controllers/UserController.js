import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const routes = {
  store: async (req, res) => {
    try {
      const { firstName, lastName, email, passwordHash } = req.body;

      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (user) {
        return res.json({ errors: ["E-mail já existe."] });
      }

      const novoUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          passwordHash,
        },
      });

      return res.json({
        firstName: novoUser.firstName,
        lastName: novoUser.lastName,
        email: novoUser.email,
      });
    } catch (error) {
      return res.status(400).json({ errors: [error.message] });
    }
  },
  index: async (req, res) => {
    try {
      if (req.userRole !== "ADMIN") {
        return res.status(403).json({ error: ["Access Forbidden"] });
      }

      const user = await prisma.user.findMany({
        select: {
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      });

      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: [error.message] });
    }
  },
  update: async (req, res) => {
    try {
      if (req.userRole !== "ADMIN") {
        if (req.body.role) {
          req.body.role = "";
        }
      }

      const user = await prisma.user.update({
        where: {
          id: Number(req.userId),
        },
        data: {
          ...req.body,
        },
      });

      const { firstName, lastName, email } = user;

      return res.json({ firstName, lastName, email });
    } catch (error) {
      return res.status(400).json({
        error: ["Something went wrong. Please verify if the data is correct."],
      });
    }
  },

  show: async (req, res) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: Number(req.userId),
        },
        include: {
          profile: true,
          picture: true,
          images: {
            select: {
              title: true,
              filename: true,
              url: true,
            },
            orderBy: { createdAt: "desc" },
          },
          posts: {
            select: {
              title: true,
              metaTitle: true,
              createdAt: true,
              updatedAt: true,
              content: true,
              published: true,
              postMeta: true,
              comments: true,
              tag: true,
              category: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      const {
        id,
        firstName,
        lastName,
        email,
        role,
        images,
        posts,
        profile,
        picture,
      } = user;

      return res.json({
        id,
        firstName,
        lastName,
        email,
        role,
        profile,
        images,
        picture,
        posts,
      });
    } catch (error) {
      return res.status(400).json({
        error: ["Something went wrong. Please verify if the data is correct."],
      });
    }
  },
};

export default routes;
