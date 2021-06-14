import bcrypt from "bcryptjs";

async function passwordHash(req, res, next) {
  const { password } = req.body;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(password, salt);
  }
  return next();
}

export default passwordHash;
