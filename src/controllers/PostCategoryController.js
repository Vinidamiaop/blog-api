import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const routes = {
  store: async (req, res) => {
    try {
      if (!req.body.postId || !req.body.categoryId) {
        return res.status(400).json({
          erros: ["The request should contain postId and categoryId."],
        });
      }

      const findPost = await prisma.post.findUnique({
        where: { id: Number(req.body.postId) },
      });
      if (!findPost) {
        return res.status(404).json({ errors: ["Post not found."] });
      }

      const findCategory = await prisma.category.findUnique({
        where: { id: Number(req.body.categoryId) },
      });
      if (!findCategory) {
        return res.status(404).json({ errors: ["Category not found."] });
      }

      const findCategoryPost = await prisma.postCategory.findUnique({
        where: {
          postId_categoryId: {
            postId: req.body.postId,
            categoryId: req.body.categoryId,
          },
        },
      });

      if (findCategoryPost) {
        return res.status(404).json({ errors: ["Relation already existis."] });
      }

      await prisma.postCategory.create({
        data: {
          postId: Number(req.body.postId),
          categoryId: Number(req.body.categoryId),
        },
      });

      return res.json({
        postId: req.body.postId,
        post: findPost.title,
        categoryId: req.body.categoryId,
        category: findCategory.title,
      });
    } catch (error) {
      return res.status(500).json({
        errors: ["Unexpected error has occurred. Please, try again."],
      });
    }
  },
  index: async (req, res) => {
    try {
      const postCategories = await prisma.postCategory.findMany({
        select: {
          category: true,
          post: true,
        },
      });

      return res.json(postCategories);
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
