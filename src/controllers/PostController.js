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
        orderBy: { createdAt: "desc" },
      });
      return res.json(posts);
    } catch (error) {
      return res.status(400).json({ errors: ["Bad Request"] });
    }
  },
  update: async (req, res) => {
    try {
      if (!req.params.id) throw new Error("Must send the post id");
      const user = await prisma.user.findFirst({
        where: { id: Number(req.userId) },
        select: { role: true },
      });

      const findPost = await prisma.post.findFirst({
        where: { id: Number(req.params.id) },
      });

      if (user.role !== "ADMIN" && findPost.authorId !== req.userId) {
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
};

export default routes;
