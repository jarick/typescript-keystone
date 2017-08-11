import {Router} from "express";
import {sync} from "glob";
import {join, resolve} from "path";
import MenuRoute from "./menu.route";

sync(resolve(join(__dirname, "../models", "*.model.ts"))).forEach((file) => require(resolve( file )));
const route = Router();

route.use("/menu", MenuRoute);

export default route;
