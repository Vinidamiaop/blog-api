import { Router } from "express";
import loginRequired from "../middlewares/loginRequired";
import categoryController from "../controllers/CategoryController";

const router = new Router();

router.post("/", loginRequired, categoryController.store);
router.get("/", categoryController.index);
router.put("/edit/:id?", loginRequired, categoryController.update);
router.delete("/delete/:id?", loginRequired, categoryController.delete);

export default router;
