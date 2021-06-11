import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ errors: ["Login required."] });
  }

  const [, token] = authorization.split(" ");

  try {
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id, email } = data;

    const user = await prisma.user.findFirst({ where: { id, email } });

    if (!user) {
      throw new Error();
    }

    req.userId = id;
    req.userEmail = email;
    req.userRole = user.role;
    return next();
  } catch (error) {
    return res.status(401).json({ errors: ["Invalid Token"] });
  }
};
