import multer from "multer";
import path from "path";

const randomNums = () => Math.floor(Math.random() * 10000 + 20000);

export default {
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg") {
      return cb(new multer.MulterError("File must be PNG or JPG"));
    }
    return cb(null, true);
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "..", "..", "uploads", "images"));
    },
    filename: (req, file, cb) => {
      cb(
        null,
        `${Date.now()}-${randomNums()}${path.extname(file.originalname)}`
      );
    },
  }),
};
