import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const routes = {
  store: async (req, res) => {
    try {
      const newCategory = await prisma.category.create({
        data: {
          title: req.body.categoryTitle,
          metaTitle: req.body.categoryMetaTitle,
          slug:
            req.body.slug ||
            req.body.categoryTitle?.toLowerCase().trim().replace(/\s/g, "-"),
          content: req.body.categoryContent,
        },
      });

      return res.json(newCategory);
    } catch (error) {
      return res.status(400).json({ errors: [error.message] });
    }
  },
  index: async (req, res) => {
    try {
      const categories = await prisma.category.findMany();
      return res.json(categories);
    } catch (error) {
      return res.status(400).json({ errors: [error.message] });
    }
  },
  update: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(403).json("Category Id must be sent");
      }

      const category = await prisma.category.update({
        where: { id: Number(req.params.id) },
        data: {
          title: req.body.categoryTitle,
          metaTitle: req.body.categoryMetaTitle,
          slug:
            req.body.slug ||
            req.body.categoryTitle?.toLowerCase().trim().replace(/\s/g, "-"),
          content: req.body.categoryContent,
        },
      });
      return res.json(category);
    } catch (error) {
      return res.status(400).json({ errors: [error.message] });
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
      return res.status(400).json({ errors: [error.message] });
    }
  },
};

export default routes;
