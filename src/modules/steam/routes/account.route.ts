import {NextFunction, Response, Router} from "express";
import {join} from "path";
import * as winston from "winston";
import keystone from "../../../config/keystone";
import passport from "../../../config/passport";
import APIError from "../../../lib/api-error/index";
import {IRequest} from "../../../lib/request/request";
import {IUser} from "../../account/models/user.model";
import {IGetInventoriesOptions, ISteamAccountModel} from "../models/account.model";

const router = Router();
const auth = (req: IRequest, res: Response, next: NextFunction) => {
    passport.authenticate("bearer", (err: any, user: IUser) => {
        if (err) {
            winston.warn("Authenticate user error", {
                message: err.message,
                stack: err.stack,
            });
            return next(err);
        }
        if (user) {
            req.user = user;
            const result = user.serialize();
            winston.debug("Authenticate user success", {result});
            next();
        } else {
            winston.debug("Authenticate user failed");
            return res.status(401).json({
                code: "unauthorized",
                status: "error",
            });
        }
    })(req, res, next);
};
router.get("/auth", auth, (req: IRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({
            code: "unauthorized",
            status: "error",
        });
    } else {
        req.session.userid = req.user.serialize().id;
        next();
    }
}, passport.authenticate("steam"));

router.get("/return", passport.authenticate("steam", {
        failureRedirect: "/api/v1/steam/account/failed",
        successRedirect: "/api/v1/steam/account/success",
    }));

router.get("/success", (req: IRequest, res: Response) => {
    res.sendFile(join(__dirname, "../views/success.html"));
});

router.get("/failed", (req: IRequest, res: Response) => {
    res.sendFile(join(__dirname, "../views/failed.html"));
});

router.get("/:userId", auth, (req: IRequest, res: Response, next: NextFunction) => {
    const SteamAccount: ISteamAccountModel = keystone.list("SteamAccount").model;
    const {userId} = req.params;
    SteamAccount.getStemIdsByUserId(userId)
        .then((ids: string[]) => {
            winston.debug("Get user array of steam id success", {
                data: {userId},
                result: ids,
            });
            res.json(ids);
        }, (err) => {
            winston.warn("Get user array of steam id", {
                data: {userId},
                message: err.message,
                stack: err.stack,
            });
            next(err);
        });
});

router.get("/:userId/:steamId", auth, (req: IRequest, res: Response, next: NextFunction) => {
    const SteamAccount: ISteamAccountModel = keystone.list("SteamAccount").model;
    const {userId, steamId} = req.params;
    SteamAccount.getAccountByUserIdAndSteamId(userId, steamId)
        .then((account) => {
            const options: IGetInventoriesOptions = {
                app: 730,
                context: 2,
                count: 5000,
                lang: "english",
            };
            return account.getInventories(options);
        })
        .then((json) => {
            winston.debug("Get steam inventory success", {
                data: {userId, steamId},
                result: json,
            });
            res.json(json);
        })
        .catch((err) => {
            if (err.type === "SteamAccountError") {
                const error = new APIError(err.message, httpStatus.NOT_FOUND, true);
                winston.debug("Get steam inventory failed", {
                    data: {userId, steamId},
                    errors: {},
                    message: error.message,
                    status: error.status,
                });
                next(error);
            } else if (err.type === "AccessInvestoryError") {
                const error = new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true);
                winston.debug("Get steam inventory failed", {
                    data: {userId, steamId},
                    errors: {},
                    message: error.message,
                    status: error.status,
                });
                next(error);
            } else {
                winston.warn("Get steam inventory error", {
                    data: {userId, steamId},
                    message: err.message,
                    stack: err.stack,
                });
                next(err);
            }
        });
});

export default router;
