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
        errors: [error.message],
      });
    }
  },
  index: async (req, res) => {
    try {
      if (req.query.sort !== "asc" && req.query.sort !== "desc") {
        req.query.sort = "desc";
      }
      const numberTake = Number(req.query.total) || 6;
      const posts = await prisma.post.findMany({
        skip: Number(req.query.page) * numberTake || 0,
        take: Number(req.query.total) || 20,
        where: {
          AND: [
            { published: true },
            {
              AND: [
                {
                  OR: [
                    { title: { contains: req.query.search } },
                    { content: { contains: req.query.search } },
                    { description: { contains: req.query.search } },
                  ],
                },
                { author: { firstName: { contains: req.query.author } } },
                { slug: { equals: req.query.slug } },
              ],
            },
          ],
        },
        include: {
          author: {
            select: { firstName: true, lastName: true },
          },
          postMeta: true,
          postTags: {
            include: { tag: true },
          },
          postCategory: {
            select: { category: true },
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
        orderBy: { createdAt: req.query.sort || "desc" },
      });

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
      return res.status(400).json({
        errors: ["Unexpected error has occurred. Please, try again."],
      });
    }
  },
  count: async (req, res) => {
    try {
      const count = await prisma.post.count({ where: { published: true } });
      return res.json(count);
    } catch (error) {
      return res.status(500).json({
        errors: ["Unexpected error has occurred. Please, try again."],
      });
    }
  },
  findCategory: async (req, res) => {
    try {
      const postCategory = await prisma.postCategory.findMany({
        where: {
          category: { slug: { equals: req.query.category } }
        },
        include: {
          post: true
        }

      })
      return res.json(postCategory)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  },
  findTag: async (req, res) => {
    try {
      const postTag = await prisma.postTag.findMany({
        where: {
          tag: { slug: { equals: req.query.tag } }
        },
        include: {
          post: true
        }

      })
      return res.json(postTag)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }
};

export default routes;
