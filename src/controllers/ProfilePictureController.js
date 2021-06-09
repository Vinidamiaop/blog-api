import { PrismaClient } from "@prisma/client";
import multer from "multer";
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
        return res.status(400).json({ errors: [err.message] });
      }
    });
  },
  update(req, res) {
    return upload(req, res, async (error) => {
      try {
        if (error) {
          throw new Error(error.code);
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
        return res.status(400).json({ errors: ["Something went wrong."] });
      }
    });
  },
  delete: async (req, res) => {
    try {
      const picture = await prisma.profilePicture.delete({
        where: { userId: req.userId },
      });

      return res.json(picture);
    } catch (error) {
      return res.json({ errors: [...error.message] });
    }
  },
};

export default routes;
