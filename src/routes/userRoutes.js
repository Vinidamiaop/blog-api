import { Router } from "express";
import userController from "../controllers/UserController";
import passwordHash from "../middlewares/passwordHash";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.post("/create", passwordHash, userController.store);
router.get("/", loginRequired, userController.index);
router.put("/edit", loginRequired, passwordHash, userController.update);
router.get("/show", loginRequired, userController.show);

export default router;
