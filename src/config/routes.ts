import {Router} from "express";
import AccountRouter from "../modules/account/routes/index.router";
import EmailRouter from "../modules/email/routes/index.route";
import MenuRouter from "../modules/menu/routes/index.route";
import SiteRouter from "../modules/site/routes/index.route";
import SteamRouter from "../modules/steam/routes/index.route";

const router = Router();
const ApiRouter = Router();

ApiRouter.use("/account", AccountRouter);
ApiRouter.use("/email", EmailRouter);
ApiRouter.use("/menu", MenuRouter);
ApiRouter.use("/site", SiteRouter);
ApiRouter.use("/steam", SteamRouter);

router.use("/api/v1", ApiRouter);

export default router;
