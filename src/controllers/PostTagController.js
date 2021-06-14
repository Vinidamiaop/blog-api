import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const routes = {
  store: async (req, res) => {
    if (!req.body.postId || !req.body.tagId) {
      return res.status(400).json({
        erros: ["The request should contain postId and tagId."],
      });
    }
    try {
      const tagPost = await prisma.postTag.create({
        data: {
          postId: req.body.postId,
          tagId: req.body.tagId,
        },
      });

      return res.json(tagPost);
    } catch (error) {
      return res.status(400).json({ errors: [error.message] });
    }
  },
  index: async (req, res) => {
    try {
      const tags = await prisma.postTag.findMany({
        select: {
          tag: true,
          post: true,
        },
      });

      return res.json(tags);
    } catch (error) {
      return res.status(400).json({ errors: [error.message] });
    }
  },
  delete: async (req, res) => {
    try {
      if (!req.body.postId || !req.body.tagId) {
        return res
          .status(400)
          .json({ errors: ["The request should contain postId and tagId."] });
      }

      const findPostTag = await prisma.postTag.findUnique({
        where: {
          postId_tagId: {
            postId: Number(req.body.postId),
            tagId: Number(req.body.tagId),
          },
        },
      });

      if (!findPostTag) {
        return res
          .status(404)
          .json({ errors: ["PostTag relation not found."] });
      }

      const deletedPostTag = await prisma.postTag.delete({
        where: {
          postId_tagId: {
            postId: Number(req.body.postId),
            tagId: Number(req.body.tagId),
          },
        },
      });

      return res.json(deletedPostTag);
    } catch (error) {
      return res.status(400).json({ errors: [error.message] });
    }
  },
};

export default routes;
