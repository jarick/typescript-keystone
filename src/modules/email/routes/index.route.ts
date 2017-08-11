import {Router} from "express";
import {sync} from "glob";
import {join, resolve} from "path";

sync(resolve(join(__dirname, "../models", "*.model.ts"))).forEach((file) => require(resolve( file )));

const router = Router();

export default router;
