import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const routes = {
  store: async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
          errors: [
            'Payload should contain "firstName", "lastName", "email", "password',
          ],
        });
      }

      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (user) {
        return res.json({ errors: ["E-mail já existe."] });
      }

      const novoUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          passwordHash: password,
        },
      });

      return res.json({
        id: novoUser.id,
        firstName: novoUser.firstName,
        lastName: novoUser.lastName,
        email: novoUser.email,
        role: novoUser.role,
      });
    } catch (error) {
      return res.status(500).json({
        errors: ["Unexpected error has occurred. Please, try again."],
      });
    }
  },
  index: async (req, res) => {
    try {
      if (req.userRole !== "ADMIN") {
        return res.status(401).json({ error: ["Unauthorized"] });
      }

      const user = await prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          profile: true,
          picture: true,
        },
      });

      return res.json(user);
    } catch (error) {
      return res
        .status(500)
        .json({ error: ["Unexpected error has occurred. Please, try again."] });
    }
  },
  update: async (req, res) => {
    try {
      if (req.userRole !== "ADMIN") {
        if (req.body.role) {
          return res.status(401).json({ errors: ["Unauthorized"] });
        }
      }

      const user = await prisma.user.update({
        where: {
          id: Number(req.userId),
        },
        data: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          role: req.body.role,
        },
      });

      const { firstName, lastName, email, role } = user;

      return res.json({ firstName, lastName, email, role });
    } catch (error) {
      return res.status(400).json({
        error: [error],
      });
    }
  },

  show: async (req, res) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: Number(req.userId),
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          profile: true,
          picture: true,
          images: true,
        },
      });

      return res.json(user);
    } catch (error) {
      return res.status(500).json({
        error: ["Unexpected error has occurred. Please, try again."],
      });
    }
  },
};

export default routes;
