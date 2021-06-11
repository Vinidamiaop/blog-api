import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const routes = {
  store: async (req, res) => {
    try {
      const post = await prisma.post.create({
        data: {
          title: req.body.title,
          metaTitle: req.body.metaTitle,
          content: req.body.content,
          authorId: req.userId,
          featuredImage: req.body.image,
          description: req.body.description,
          postMeta: {
            create: {
              key: "excerpt",
              content: req.body.excerpt,
            },
          },
        },
      });

      return res.json(post);
    } catch (error) {
      return res.status(400).json({ errors: [error.message] });
    }
  },
  index: async (req, res) => {
    try {
      const posts = await prisma.post.findMany({
        where: {
          AND: [
            { published: true },
            {
              OR: [
                { title: { contains: req.query.search } },
                { content: { contains: req.query.search } },
              ],
            },
          ],
        },
        include: {
          postMeta: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return res.json(posts);
    } catch (error) {
      return res.status(400).json({ errors: ["Bad Request"] });
    }
  },
  update: async (req, res) => {
    try {
      if (!req.params.id) throw new Error("Id Must be sent.");

      const findPost = await prisma.post.findFirst({
        where: { id: Number(req.params.id) },
      });

      if (!findPost) {
        return res.status(404).json({ errors: ["Post do not exists."] });
      }

      if (req.userRole !== "ADMIN" && findPost.authorId !== req.userId) {
        return res.status(403).json({ errors: ["Access Forbidden"] });
      }

      const post = await prisma.post.update({
        where: { id: Number(req.params.id) },
        data: {
          title: req.body.title,
          metaTitle: req.body.metaTitle,
          content: req.body.content,
          published: req.body.published,
        },
      });
      return res.json(post);
    } catch (error) {
      return res.status(400).json({ errors: [error.message] });
    }
  },

  delete: async (req, res) => {
    try {
      if (!req.params.id) throw new Error("Id Must be sent.");

      const findPost = await prisma.post.findFirst({
        where: { id: Number(req.params.id) },
      });

      if (!findPost) {
        return res.status(404).json({ errors: ["Post do not exists."] });
      }

      if (req.userRole !== "ADMIN" && findPost.authorId !== req.userId) {
        return res.status(403).json({ errors: ["Access Forbidden"] });
      }

      await prisma.postMeta.deleteMany({
        where: { postId: Number(req.params.id) },
      });
      const post = await prisma.post.delete({
        where: { id: Number(req.params.id) },
      });
      return res.json(post);
    } catch (error) {
      return res.status(400).json({ errors: [error.message] });
    }
  },
};

export default routes;
