import path from 'path';
import fs from 'fs/promises';

export default async function deleteImages(image) {
  try {
    const pathDir = path.resolve(__dirname, '..', '..', 'uploads')
    const files = await fs.readdir(`${pathDir}/images/`)
    files.forEach((file) => {
      if (file.includes(image)) {
        fs.unlink(
          path.resolve(
            __dirname,
            "..",
            "..",
            "uploads",
            "images",
            file
          )
        );
      }

    })

    return 'ok'
  } catch (error) {
    return error
  }
}