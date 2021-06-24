import path from 'path';
import Jimp from 'jimp';

export default async function imageResize(config) {
  try {
    const image = await Jimp.read(config.file)
    const fileDir = path.resolve(__dirname, "..", "..", "uploads", "images")
    Object.entries(config.imageSize).forEach((item) => {
      image.resize(item[1], Jimp.AUTO);
      image.quality(100);
      image.write(`${fileDir}/${item[0]}-${config.filename}`)
    })
    return image
  } catch (error) {
    console.log(error.message)
    return error.message
  }


}