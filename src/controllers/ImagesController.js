import { PrismaClient } from "@prisma/client";
import path from "path";
import { unlink } from "fs/promises";
import multer from "multer";
import multerConfig from "../config/multerConfig";

const upload = multer(multerConfig).single("image");
const prisma = new PrismaClient();

const routes = {
  store(req, res) {
    return upload(req, res, async (error) => {
      try {
        if (error) {
          throw new Error(error.code);
        }

        const picture = await prisma.images.create({
          data: {
            title: req.body.title,
            description: req.body.description,
            originalname: req.file.originalname,
            filename: req.file.filename,
            url: `${process.env.APP_URL}/images/${req.file.filename}`,
            authorId: req.userId,
          },
        });

        return res.json(picture);
      } catch (err) {
        return res.status(400).json({ errors: [err] });
      }
    });
  },
  index: async (req, res) => {
    try {
      const images = await prisma.images.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          originalname: true,
          filename: true,
          url: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return res.json(images);
    } catch (err) {
      return res.status(400).json({ errors: ["Something went wrong"] });
    }
  },
  show: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ errors: ["Id must be sent."] });
      }

      const image = await prisma.images.findFirst({
        where: { id: Number(req.params.id) },
      });

      if (!image) {
        return res.status(404).json({ errors: ["Image not found"] });
      }

      return res.json(image);
    } catch (err) {
      return res.status(400).json({ errors: ["Something went wrong"] });
    }
  },
  delete: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ errors: ["Id must be sent."] });
      }

      const findPost = await prisma.images.findFirst({
        where: { id: Number(req.params.id) },
      });

      if (!findPost) {
        return res.status(404).json({ errors: ["Image do not exists."] });
      }

      if (req.userRole !== "ADMIN" || findPost.authorId !== req.userId) {
        return res.status(403).json({ errors: ["Access Forbbiden"] });
      }
      const picture = await prisma.images.delete({
        where: { id: Number(req.params.id) },
      });

      await unlink(
        path.resolve(
          __dirname,
          "..",
          "..",
          "uploads",
          "images",
          picture.filename
        )
      );

      return res.json(picture);
    } catch (error) {
      return res.json({ errors: [error] });
    }
  },
};

export default routes;
