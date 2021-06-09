import { Router } from "express";
import profileController from "../controllers/ProfileController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.post("/", loginRequired, profileController.store);
router.put("/edit", loginRequired, profileController.update);
router.delete("/delete", loginRequired, profileController.delete);

export default router;
