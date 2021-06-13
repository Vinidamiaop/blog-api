import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const routes = {
  store: async (req, res) => {
    try {
      const tag = await prisma.tag.create({
        data: {
          title: req.body.title,
          metaTitle: req.body.metaTitle,
          slug:
            req.body.slug ||
            req.body.title.toLowerCase().trim().replace(/\s/g, "-"),
          content: req.body.content,
        },
      });

      return res.json(tag);
    } catch (error) {
      return res.status(400).json({ errors: error.message });
    }
  },
  index: async (req, res) => {
    try {
      const tags = await prisma.tag.findMany({
        select: {
          id: true,
          title: true,
          metaTitle: true,
          content: true,
          slug: true,
        },
      });

      return res.json(tags);
    } catch (error) {
      return res.status(400).json({ errors: error.message });
    }
  },
  update: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ errors: ["Tag id must be sent."] });
      }

      if (req.userRole !== "ADMIN") {
        return res
          .status(401)
          .json({ errors: ["Unauthorized. User must be Admin"] });
      }

      const tagFind = await prisma.tag.findFirst({
        where: { id: Number(req.params.id) },
      });

      if (!tagFind) {
        return res.status(404).json({ errors: ["Tag not found."] });
      }

      const tagUpdated = await prisma.tag.update({
        where: { id: Number(req.params.id) },
        data: {
          title: req.body.title,
          metaTitle: req.body.metaTitle,
          slug: req.body.slug || req.body.title.toLowerCase(),
          content: req.body.content,
        },
      });

      return res.json(tagUpdated);
    } catch (error) {
      return res.status(400).json({ errors: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ errors: ["Tag id must be sent."] });
      }

      if (req.userRole !== "ADMIN") {
        return res
          .status(401)
          .json({ errors: ["Unauthorized. User must be Admin"] });
      }

      const tagFind = await prisma.tag.findFirst({
        where: { id: Number(req.params.id) },
      });

      if (!tagFind) {
        return res.status(404).json({ errors: ["Tag not found."] });
      }
      const tagDeleted = await prisma.tag.delete({
        where: { id: Number(req.params.id) },
      });

      return res.json(tagDeleted);
    } catch (error) {
      return res.status(400).json({ errors: error.message });
    }
  },
};

export default routes;
