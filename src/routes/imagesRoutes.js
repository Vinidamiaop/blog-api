import { Router } from "express";
import imagesController from "../controllers/ImagesController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.post("/", loginRequired, imagesController.store);
router.get("/", imagesController.index);
router.get("/show/:id?", imagesController.show);
router.put("/edit/:id?", loginRequired, imagesController.update);
router.delete("/delete/:id?", loginRequired, imagesController.delete);

export default router;
