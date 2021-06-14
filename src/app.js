import express from "express";
import path from "path";

import userRoutes from "./routes/userRoutes";
import tokenRoutes from "./routes/tokenRoutes";
import profileRoutes from "./routes/profileRoutes";
import profilePictureRoutes from "./routes/profilePictureRoutes";
import postRoutes from "./routes/postRoutes";
import imagesRoutes from "./routes/imagesRoutes";
import postCommentsRoutes from "./routes/postCommentsRoutes";
import tagRoutes from "./routes/tagRoutes";
import postTagRoutes from "./routes/postTagRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import postCategoryRoutes from "./routes/postCategoryRoutes";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "..", "uploads")));

app.use("/user", userRoutes);
app.use("/user/profile", profileRoutes);
app.use("/user/profile-picture", profilePictureRoutes);
app.use("/token", tokenRoutes);
app.use("/posts", postRoutes);
app.use("/posts-comments", postCommentsRoutes);
app.use("/images", imagesRoutes);
app.use("/tags", tagRoutes);
app.use("/post-tag", postTagRoutes);
app.use("/categories", categoryRoutes);
app.use("/post-category", postCategoryRoutes);

export default app;
