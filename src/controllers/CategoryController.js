import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const routes = {
  store: async (req, res) => {
    try {
      if (!req.body.title) {
        return res
          .status(400)
          .json({ errrors: ["Category title is required."] });
      }

      const findCateogory = await prisma.category.findUnique({
        where: { title: req.body.title },
      });
      if (findCateogory) {
        return res.status(400).json({ errors: ["Category already existis."] });
      }

      const newCategory = await prisma.category.create({
        data: {
          title: req.body.title,
          metaTitle: req.body.metaTitle,
          slug:
            req.body.slug?.toLowerCase().trim().replace(/\s/g, "-") ||
            req.body.title?.toLowerCase().trim().replace(/\s/g, "-"),
          content: req.body.content,
        },
      });

      return res.json(newCategory);
    } catch (error) {
      return res.status(400).json({
        errors: ["Unexpected error has occurred. Please, try again."],
      });
    }
  },
  index: async (req, res) => {
    try {
      const categories = await prisma.category.findMany({
        where: {
          AND: [
            {
              slug: { equals: req.query.slug }
            }
          ]
        },
        orderBy: { title: 'asc' }
      });
      return res.json(categories);
    } catch (error) {
      return res.status(500).json({
        errors: ["Unexpected error has occurred. Please, try again."],
      });
    }
  },
  update: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(403).json("Category Id is required.");
      }

      const findCateogory = await prisma.category.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!findCateogory) {
        return res.status(404).json({ errors: ["Category not found."] });
      }

      const category = await prisma.category.update({
        where: { id: Number(req.params.id) },
        data: {
          title: req.body.categoryTitle,
          metaTitle: req.body.categoryMetaTitle,
          slug:
            req.body.slug?.toLowerCase().trim().replace(/\s/g, "-") ||
            req.body.categoryTitle?.toLowerCase().trim().replace(/\s/g, "-"),
          content: req.body.categoryContent,
        },
      });
      return res.json(category);
    } catch (error) {
      return res.status(400).json({
        errors: ["Unexpected error has occurred. Please, try again."],
      });
    }
  },
  delete: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(403).json("Category Id must be sent");
      }

      if (req.userRole !== "ADMIN") {
        return res.status(401).json("Unauthorizer. User should be ADMIN");
      }

      const findCategory = await prisma.category.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!findCategory) {
        return res.status(404).json({ errors: ["Category not found."] });
      }

      const category = await prisma.category.delete({
        where: { id: Number(req.params.id) },
      });
      return res.json(category);
    } catch (error) {
      return res.status(400).json({
        errors: ["Unexpected error has occurred. Please, try again."],
      });
    }
  },
};

export default routes;
