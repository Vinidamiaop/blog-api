import { Router } from "express";
import imagesController from "../controllers/ImagesController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get("/", imagesController.index);
router.get("/show/:id?", imagesController.show);
router.post("/", loginRequired, imagesController.store);
router.delete("/delete/:id?", loginRequired, imagesController.delete);

export default router;
