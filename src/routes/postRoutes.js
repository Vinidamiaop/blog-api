import { Router } from "express";
import postController from "../controllers/PostController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.post("/", loginRequired, postController.store);
router.get("/", postController.index);
router.get("/categories", postController.findCategory);
router.get("/tags", postController.findTag);
router.get("/count", postController.count);
router.put("/edit/:id?", loginRequired, postController.update);
router.delete("/delete/:id?", loginRequired, postController.delete);

export default router;
