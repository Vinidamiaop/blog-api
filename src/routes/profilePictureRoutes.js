import { Router } from "express";
import profilePictureController from "../controllers/ProfilePictureController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.post("/", loginRequired, profilePictureController.store);
router.put("/update", loginRequired, profilePictureController.update);
router.delete("/delete", loginRequired, profilePictureController.delete);

export default router;
