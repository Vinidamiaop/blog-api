import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const routes = {
  store: async (req, res) => {
    try {
      const { tagTitle, tagMetaTitle, tagSlug, tagContent } = req.body;
      if (!tagTitle) {
        return res.status(400).json({ errors: ["tagTitle is required."] });
      }
      const tag = await prisma.tag.create({
        data: {
          title: tagTitle,
          metaTitle: tagMetaTitle,
          slug:
            tagSlug?.toLowerCase().trim().replace(/\s/g, "-") ||
            tagTitle?.toLowerCase().trim().replace(/\s/g, "-"),
          content: tagContent,
        },
      });

      return res.json(tag);
    } catch (error) {
      return res
        .status(500)
        .json({ errors: ["Unexpected error has occurred. Please, try again"] });
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
      return res
        .status(500)
        .json({ errors: ["Unexpected error has occurred. Please, try again"] });
    }
  },
  update: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ errors: ["Tag id must be sent."] });
      }

      if (req.userRole !== "ADMIN") {
        return res.status(401).json({ errors: ["Unauthorized."] });
      }

      const tagFind = await prisma.tag.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!tagFind) {
        return res.status(404).json({ errors: ["Tag not found."] });
      }

      const tagUpdated = await prisma.tag.update({
        where: { id: Number(req.params.id) },
        data: {
          title: req.body.tagTitle,
          metaTitle: req.body.tagMetaTitle,
          slug:
            req.body.tagSlug?.toLowerCase().trim().replace(/\s/g, "-") ||
            req.body.tagTitle?.toLowerCase().trim().replace(/\s/g, "-"),
          content: req.body.tagContent,
        },
      });

      return res.json(tagUpdated);
    } catch (error) {
      return res
        .status(500)
        .json({ errors: ["Unexpected error has occurred. Please, try again"] });
    }
  },
  delete: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ errors: ["Tag id must be sent."] });
      }

      if (req.userRole !== "ADMIN") {
        return res.status(401).json({ errors: ["Unauthorized."] });
      }

      const tagFind = await prisma.tag.findUnique({
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
      return res
        .status(500)
        .json({ errors: ["Unexpected error has occurred. Please, try again"] });
    }
  },
};

export default routes;
