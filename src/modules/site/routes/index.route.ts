import {Router} from "express";
import {sync} from "glob";
import {join, resolve} from "path";
import LayoutRoute from "./layout.route";
import PageRoute from "./page.route";

sync(resolve(join(__dirname, "../models", "*.model.ts"))).forEach((file) => require(resolve( file )));

const route = Router();

route.use("/layout", LayoutRoute);
route.use("/pages", PageRoute);

export default route;
