import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const routes = {
  store: async (req, res) => {
    try {
      if (!req.body.content || !req.body.postId) {
        return res
          .status(400)
          .json({ errors: ["Content and Post id are required."] });
      }
      const comment = await prisma.postComment.create({
        data: {
          authorId: Number(req.userId),
          content: req.body.content,
          published: req.body.published,
          postId: Number(req.body.postId),
        },
      });

      return res.json(comment);
    } catch (error) {
      return res.status(500).json({
        errors: ["Unexpected error has occurred. Please, try again."],
      });
    }
  },
  index: async (req, res) => {
    try {
      console.log("oi");
      const comments = await prisma.postComment.findMany({
        where: { authorId: req.userId },
      });

      return res.json(comments);
    } catch (error) {
      return res
        .status(500)
        .json({
          errors: ["Unexpected error has occurred. Please, try again."],
        });
    }
  },
  update: async (req, res) => {
    try {
      if (!req.params.id) {
        return res
          .status(400)
          .json({ errors: ["The comment id must be sent."] });
      }

      const findComment = await prisma.postComment.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!findComment) {
        return res.status(400).json({ errors: ["Comment not found."] });
      }

      if (req.userRole !== "ADMIN" || findComment.authorId !== req.userId) {
        return res.status(400).json({ errors: ["Unauthorized."] });
      }

      const commentUpdate = await prisma.postComment.update({
        where: { id: Number(req.params.id) },
        data: {
          content: req.body.content,
          published: req.body.published,
        },
      });

      return res.json(commentUpdate);
    } catch (error) {
      return res.status(500).json({
        errors: ["Unexpected error has occurred. Please, try again."],
      });
    }
  },
  delete: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(401).json({ errors: ["The post id must be sent."] });
      }

      const findComment = await prisma.postComment.findFirst({
        where: { id: Number(req.params.id) },
      });

      if (!findComment) {
        return res.status(400).json({ errors: ["Comment not found."] });
      }

      if (req.userRole !== "ADMIN" || findComment.authorId !== req.userId) {
        return res.status(400).json({ errors: ["Unauthorized."] });
      }

      const commentDelete = await prisma.postComment.delete({
        where: { id: Number(req.params.id) },
      });

      return res.json(commentDelete);
    } catch (error) {
      return res.status(500).json({
        errors: ["Unexpected error has occurred. Please, try again."],
      });
    }
  },
};

export default routes;
