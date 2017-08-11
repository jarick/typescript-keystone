import {Router} from "express";
import {sync} from "glob";
import {join, resolve} from "path";
import AccountRoute from "./account.route";

sync(resolve(join(__dirname, "../models", "*.model.ts"))).forEach((file) => require(resolve( file )));

const route = Router();

route.use("/account", AccountRoute);

export default route;
