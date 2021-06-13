import { PrismaClient } from "@prisma/client";
import permissionValidator from "../helper/permissionValidator";

const prisma = new PrismaClient();

const routes = {
  store: async (req, res) => {
    try {
      const comment = await prisma.postComment.create({
        data: {
          authorId: Number(req.userId),
          content: req.body.content,
          published: req.body.published,
          postId: Number(req.body.post),
        },
      });

      return res.json(comment);
    } catch (error) {
      return res.status(400).json({ errors: [error] });
    }
  },
  update: async (req, res) => {
    try {
      if (!req.params.id) {
        return res
          .status(401)
          .json({ errors: ["The comment id must be sent."] });
      }

      const findComment = await prisma.postComment.findFirst({
        where: { id: Number(req.params.id) },
      });

      const validator = permissionValidator({
        userRole: req.userRole,
        ownerId: findComment.authorId,
        userId: req.userId,
      });

      if (!validator) {
        return res.status(400).json({ errors: ["Access Forbbiden."] });
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
      return res.status(400).json({ errors: [error] });
    }
  },
  delete: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(401).json({ errors: ["The post id must be sent."] });
      }

      const findPost = await prisma.postComment.findFirst({
        where: { id: Number(req.params.id) },
      });

      const validator = permissionValidator({
        userRole: req.userRole,
        ownerId: findPost.authorId,
        userId: req.userId,
      });

      if (!validator) {
        return res.status(400).json({ errors: ["Access Forbbiden."] });
      }

      const commentDelete = await prisma.postComment.delete({
        where: { id: Number(req.params.id) },
      });

      return res.json(commentDelete);
    } catch (error) {
      return res.status(400).json({ errors: [error] });
    }
  },
};

export default routes;
