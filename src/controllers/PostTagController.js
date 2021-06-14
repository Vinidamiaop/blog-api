import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const routes = {
  store: async (req, res) => {
    try {
      if (!req.body.postId || !req.body.tagId) {
        return res.status(400).json({
          erros: ["postId and tagId are required."],
        });
      }

      const findTag = await prisma.tag.findUnique({
        where: { id: req.body.tagId },
      });
      const findPost = await prisma.post.findUnique({
        where: { id: req.body.postId },
      });

      if (!findTag) {
        return res.status(404).json({ errors: ["Tag not found."] });
      }

      if (!findPost) {
        return res.status(404).json({ errors: ["Post not found."] });
      }

      const findPostTag = await prisma.postTag.findUnique({
        where: {
          postId_tagId: {
            postId: req.body.postId,
            tagId: req.body.tagId,
          },
        },
      });

      if (findPostTag) {
        return res.status(400).json({ errors: ["Relation already existis."] });
      }

      await prisma.postTag.create({
        data: {
          postId: req.body.postId,
          tagId: req.body.tagId,
        },
      });

      return res.json({
        postId: findPost.id,
        tagId: findTag.id,
        postTitle: findPost.title,
        tagTitle: findTag.title,
      });
    } catch (error) {
      return res.status(500).json({
        errors: ["Unexpected error has occurred. Please, try again."],
      });
    }
  },
  index: async (req, res) => {
    try {
      const tags = await prisma.postTag.findMany({
        select: {
          tag: {
            select: {
              id: true,
              title: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      return res.json(tags);
    } catch (error) {
      return res.status(500).json({
        errors: ["Unexpected error has occurred. Please, try again."],
      });
    }
  },
  delete: async (req, res) => {
    try {
      if (!req.body.postId || !req.body.tagId) {
        return res
          .status(400)
          .json({ errors: ["postId and tagId are required."] });
      }

      const findPostTag = await prisma.postTag.findUnique({
        where: {
          postId_tagId: {
            postId: Number(req.body.postId),
            tagId: Number(req.body.tagId),
          },
        },
        select: {
          post: {
            select: {
              id: true,
              title: true,
            },
          },
          tag: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      if (!findPostTag) {
        return res
          .status(404)
          .json({ errors: ["PostTag relation not found."] });
      }

      await prisma.postTag.delete({
        where: {
          postId_tagId: {
            postId: Number(req.body.postId),
            tagId: Number(req.body.tagId),
          },
        },
      });

      return res.json(findPostTag);
    } catch (error) {
      return res.status(500).json({
        errors: ["Unexpected error has occurred. Please, try again."],
      });
    }
  },
};

export default routes;
