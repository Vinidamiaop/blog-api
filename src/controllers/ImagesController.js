import { PrismaClient } from "@prisma/client";
import multer from "multer";
import multerConfig from "../config/multerConfig";
import imageResize from "../utils/imageResize";
import deleteImages from "../utils/deleteImages";

const upload = multer(multerConfig).single("image");
const prisma = new PrismaClient();

const routes = {
  store(req, res) {
    return upload(req, res, async (error) => {
      try {
        if (error) {
          return res.status(400).json(error.code);
        }


        const image = await prisma.images.create({
          data: {
            title: req.body.title,
            description: req.body.description,
            originalname: req.file.originalname,
            filename: req.file.filename,
            url: {
              create: {
                original: `${process.env.APP_URL}/images/${req.file.filename}`,
                avg: `${process.env.APP_URL}/images/avg-${req.file.filename}`,
                small: `${process.env.APP_URL}/images/small-${req.file.filename}`,
              }
            },
            authorId: req.userId,
          },
        });


        imageResize({
          file: `${process.env.APP_URL}/images/${image.filename}`,
          filename: image.filename,
          imageSize: {
            small: 300,
            avg: 600
          }
        })

        return res.json({
          title: image.title,
          description: image.description,
          originalname: image.originalname,
          filename: image.filename,
          url: image.url,
        });
      } catch (err) {
        return res.status(500).json({
          errors: ["Unexpected error has occurred. Please, try again."],
        });
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
      return res.status(500).json({
        errors: ["Unexpected error has occurred. Please, try again."],
      });
    }
  },
  show: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ errors: ["image Id is required."] });
      }

      const image = await prisma.images.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!image) {
        return res.status(404).json({ errors: ["Image not found"] });
      }

      return res.json(image);
    } catch (err) {
      return res.status(500).json({
        errors: ["Unexpected error has occurred. Please, try again."],
      });
    }
  },
  update: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ errors: ["Id is required."] });
      }

      if (!req.body.title && !req.body.description) {
        return res
          .status(400)
          .json({ errors: ["Image title or description are required."] });
      }

      const findPost = await prisma.images.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!findPost) {
        return res.status(404).json({ errors: ["Image not found."] });
      }

      if (req.userRole !== "ADMIN" || findPost.authorId !== req.userId) {
        return res.status(401).json({ errors: ["Unauthorized."] });
      }
      const image = await prisma.images.update({
        where: { id: Number(req.params.id) },
        data: {
          title: req.body.title,
          description: req.body.description,
        },
      });

      return res.json(image);
    } catch (error) {
      return res.json({
        errors: ["Unexpected error has occurred. Please, try again."],
      });
    }
  },
  delete: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ errors: ["Id must be sent."] });
      }

      const findPost = await prisma.images.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!findPost) {
        return res.status(404).json({ errors: ["Image not found."] });
      }

      if (req.userRole !== "ADMIN" || findPost.authorId !== req.userId) {
        return res.status(401).json({ errors: ["Unauthorized."] });
      }

      const picture = await prisma.images.delete({
        where: { id: Number(req.params.id) },

      });

      await deleteImages(picture.filename);

      return res.json(picture);
    } catch (error) {
      return res.json({
        errors: [error.message],
      });
    }
  },
};

export default routes;
