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

      const postCategory = await prisma.postCategory.create({
        data: {
          postId: Number(req.body.postId),
          categoryId: Number(req.body.categoryId),
        },
      });

      return res.json(postCategory);
    } catch (error) {
      return res.status(400).json({ errors: [error.message] });
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
      return res.status(400).json({ errors: [error.message] });
    }
  },
};

export default routes;
