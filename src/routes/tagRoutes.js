import { Router } from "express";
import tagController from "../controllers/TagController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.post("/", loginRequired, tagController.store);
router.get("/", tagController.index);
router.put("/edit/:id?", loginRequired, tagController.update);
router.delete("/delete/:id?", loginRequired, tagController.delete);

export default router;
