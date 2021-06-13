import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function tagCatCreator(type, config) {
  if (type === "tag") {
    const object = config.title
      ? await prisma.tag.findUnique({
          where: { title: config.title },
        })
      : await prisma.tag.findUnique({
          where: { id: config.typeId },
        });

    if (!object) {
      const newObj = await prisma.tag.create({
        data: {
          title: config.title,
          metaTitle: config.metaTitle,
          slug:
            config.slug ||
            config.title?.toLowerCase().trim().replace(/\s/g, "-"),
          content: config.content,
        },
      });

      await prisma.postTag.create({
        data: {
          postId: Number(config.postId),
          tagId: Number(newObj.id),
        },
      });
    } else {
      await prisma.postTag.create({
        data: {
          postId: Number(config.postId),
          tagId: Number(config.typeId),
        },
      });
    }
  } else if (type === "category") {
    const object = config.title
      ? await prisma.category.findUnique({
          where: { title: config.title },
        })
      : await prisma.category.findUnique({
          where: { id: config.typeId },
        });

    if (!object) {
      const newObj = await prisma.category.create({
        data: {
          title: config.title,
          metaTitle: config.metaTitle,
          slug:
            config.slug ||
            config.title?.toLowerCase().trim().replace(/\s/g, "-"),
          content: config.content,
        },
      });

      await prisma.postCategory.create({
        data: {
          postId: Number(config.postId),
          categoryId: Number(newObj.id),
        },
      });
    } else {
      await prisma.postCategory.create({
        data: {
          postId: Number(config.postId),
          categoryId: Number(config.typeId),
        },
      });
    }
  } else {
    throw new Error('Type must be "tag" or "Category" ');
  }
}

export default tagCatCreator;
