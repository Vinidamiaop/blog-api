import { Router } from "express";
import postTagController from "../controllers/PostTagController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.post("/", loginRequired, postTagController.store);
router.get("/", postTagController.index);
router.delete("/delete", loginRequired, postTagController.delete);

export default router;
