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
          return res.status(401).json({ errors: ["Unauthorized"] });
        }
      }

      const user = await prisma.user.update({
        where: {
          id: Number(req.userId),
        },
        data: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          role: req.body.role,
        },
      });

      const { firstName, lastName, email, role } = user;

      return res.json({ firstName, lastName, email, role });
    } catch (error) {
      return res.status(400).json({
        error: [error],
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
          userComments: {
            select: {
              id: true,
              content: true,
              published: true,
              updatedAt: true,
              postId: true,
            },
            orderBy: { createdAt: "desc" },
          },
          posts: {
            select: {
              title: true,
              metaTitle: true,
              content: true,
              comments: true,
              postMeta: true,
              published: true,
              tag: true,
              category: true,
              createdAt: true,
              updatedAt: true,
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
        userComments,
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
        picture,
        images,
        userComments,
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
