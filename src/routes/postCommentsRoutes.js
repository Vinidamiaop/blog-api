import { Router } from "express";
import postCommentsController from "../controllers/PostCommentsController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.post("/", loginRequired, postCommentsController.store);
router.put("/update/:id?", loginRequired, postCommentsController.update);
router.delete("/delete/:id?", loginRequired, postCommentsController.delete);

export default router;
