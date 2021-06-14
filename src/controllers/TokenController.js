import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const passwordIsValid = (password, passwordHash) => {
  const result = bcrypt.compare(password, passwordHash);
  return result;
};

const routes = {
  async store(req, res) {
    try {
      const { email = "", password = "" } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ errors: ["Email and Password required."] });
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ errors: ["User not found."] });
      }

      const validate = await passwordIsValid(password, user.passwordHash);
      if (!validate) {
        return res.status(401).json({ errors: ["Unauthorized"] });
      }
      const { id } = user;

      const token = jwt.sign({ id, email }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION,
      });

      return res.json({ token });
    } catch (error) {
      return res.status(500).json({
        errors: ["Unexpected error has occurred. Please, try again."],
      });
    }
  },
};

export default routes;
