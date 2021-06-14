import { Router } from "express";
import loginRequired from "../middlewares/loginRequired";
import postCategoryController from "../controllers/PostCategoryController";

const router = new Router();

router.post("/", loginRequired, postCategoryController.store);
router.get("/", postCategoryController.index);

export default router;
