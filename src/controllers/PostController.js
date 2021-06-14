import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const routes = {
  store: async (req, res) => {
    try {
      if (!req.body.title) {
        return res.status(400).json({ erros: ["Title is required."] });
      }

      const findPost = await prisma.post.findUnique({
        where: { title: req.body.title },
      });

      if (findPost) {
        return res
          .status(400)
          .json({ errors: ["Post title should be unique."] });
      }

      const post = await prisma.post.create({
        data: {
          title: req.body.title,
          slug:
            req.body.slug?.toLowerCase().trim().replace(/\s/g, "-") ||
            req.body.title?.toLowerCase().trim().replace(/\s/g, "-"),
          metaTitle: req.body.metaTitle || req.body.title,
          content: req.body.content,
          authorId: req.userId,
          featuredImage: req.body.image,
          description: req.body.description,
          postMeta: {
            create: {
              key: req.body.postMetaKey,
              content: req.body.postMetaContent,
            },
          },
          published: req.body.published,
        },
      });

      return res.json(post);
    } catch (error) {
      return res.status(500).json({
        errors: ["Unexpected error has occurred. Please, try again."],
      });
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
          postTags: {
            include: { tag: true },
          },
          postCategory: {
            include: { category: true },
          },
          comments: {
            select: {
              id: true,
              content: true,
              published: true,
              updatedAt: true,
              postId: true,
            },
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.json(posts);
    } catch (error) {
      return res.status(500).json({
        errors: ["Unexpected error has occurred. Please, try again."],
      });
    }
  },
  show: async (req, res) => {
    try {
      const posts = await prisma.post.findUnique({
        where: { slug: req.params.slug },
        include: {
          postMeta: true,
          postTags: {
            select: {
              tag: true,
            },
          },
          comments: {
            select: {
              id: true,
              content: true,
              published: true,
              updatedAt: true,
              postId: true,
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!posts) {
        return res.status(404).json({ errors: ["Page not found."] });
      }

      return res.json(posts);
    } catch (error) {
      return res.status(500).json({
        errors: ["Unexpected error has occurred. Please, try again."],
      });
    }
  },
  update: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ errors: ["Id must be sent"] });
      }

      const findPost = await prisma.post.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!findPost) {
        return res.status(404).json({ errors: ["Post not found."] });
      }

      if (req.userRole !== "ADMIN" && findPost.authorId !== req.userId) {
        return res.status(401).json({ errors: ["Unauthorized."] });
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
      return res.status(500).json({
        errors: ["Unexpected error has occurred. Please, try again."],
      });
    }
  },

  delete: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ errors: ["Id must be sent"] });
      }

      const findPost = await prisma.post.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!findPost) {
        return res.status(404).json({ errors: ["Post not found."] });
      }

      if (req.userRole !== "ADMIN" && findPost.authorId !== req.userId) {
        return res.status(401).json({ errors: ["Unauthorized."] });
      }

      const post = await prisma.post.delete({
        where: { id: Number(req.params.id) },
      });
      return res.json(post);
    } catch (error) {
      return res
        .status(400)
        .json({
          errors: ["Unexpected error has occurred. Please, try again."],
        });
    }
  },
};

export default routes;
