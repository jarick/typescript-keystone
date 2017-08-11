import {Router} from "express";
import {sync} from "glob";
import {join, resolve} from "path";
import AuthRouter from "./auth.router";
import UserRouter from "./user.router";

sync(resolve(join(__dirname, "../models", "*.model.ts"))).forEach((file) => require(resolve( file )));
const router = Router();
router.use("/users", UserRouter);
router.use("/auth", AuthRouter);

export default router;
