import { PrismaClient } from "@prisma/client";
import multer from "multer";
import { unlink } from "fs/promises";
import path from "path";
import multerConfig from "../config/multerConfig";

const upload = multer(multerConfig).single("picture");
const prisma = new PrismaClient();

const routes = {
  store(req, res) {
    return upload(req, res, async (error) => {
      try {
        if (error) {
          throw new Error(error.code);
        }

        const picture = await prisma.profilePicture.create({
          data: {
            originalname: req.file.originalname,
            filename: req.file.filename,
            url: `${process.env.APP_URL}/images/${req.file.filename}`,
            userId: req.userId,
          },
        });

        return res.json(picture);
      } catch (err) {
        return res.status(500).json({
          errors: ["Unexpected error has occurred. Please, try again."],
        });
      }
    });
  },
  update(req, res) {
    return upload(req, res, async (error) => {
      try {
        if (error) {
          throw new Error(error.code);
        }

        const findPicture = await prisma.profilePicture.findUnique({
          where: { userId: req.userId },
        });

        if (!findPicture) {
          return res
            .status(404)
            .json({ errors: ["Profile Picture not found."] });
        }

        const picture = await prisma.profilePicture.update({
          where: { userId: req.userId },
          data: {
            originalname: req.file.originalname,
            filename: req.file.filename,
            url: `${process.env.APP_URL}/images/${req.file.filename}`,
          },
        });

        return res.json(picture);
      } catch (err) {
        return res.status(500).json({
          errors: ["Unexpected error has occurred. Please, try again."],
        });
      }
    });
  },
  delete: async (req, res) => {
    try {
      const findPicture = await prisma.profilePicture.findUnique({
        where: { userId: req.userId },
      });

      if (!findPicture) {
        return res.status(404).json({ errors: ["Profile Picture not found."] });
      }

      const picture = await prisma.profilePicture.delete({
        where: { userId: req.userId },
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
      return res
        .status(500)
        .json({
          errors: ["Unexpected error has occurred. Please, try again."],
        });
    }
  },
};

export default routes;
