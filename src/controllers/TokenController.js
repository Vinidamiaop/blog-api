import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const passwordIsValid = (password, passwordHash) => {
  const result = bcrypt.compare(password, passwordHash);
  return result;
};

const rotas = {
  async store(req, res) {
    try {
      const { email = "", password = "" } = req.body;
      if (!email || !password) {
        throw new Error("Email and Password are required.");
      }

      const user = await prisma.user.findFirst({
        where: { email },
      });

      if (!user) {
        throw new Error("User do not exist.");
      }

      const validate = await passwordIsValid(password, user.passwordHash);
      if (!validate) {
        throw new Error("Invalid credentials");
      }
      const { id } = user;

      const token = jwt.sign({ id, email }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION,
      });

      res.json({ token });
    } catch (error) {
      res.status(400).json({ errors: [error.message] });
    }
  },
};

export default rotas;
