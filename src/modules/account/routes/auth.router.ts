import {NextFunction, Request, Response, Router} from "express";
import * as httpStatus from "http-status";
import {sign} from "jsonwebtoken";
import * as winston from "winston";
import config from "../../../config/config";
import keystone from "../../../config/keystone";
import passport from "../../../config/passport";
import APIError from "../../../lib/api-error/index";
import {IRequest} from "../../../lib/request/request";
import {IUser, IUserModel} from "../models/user.model";

const router = Router();

router.post("/register", (req: Request, res: Response, next: NextFunction) => {
    req.checkBody("email").isEmail().notEmpty();
    req.checkBody("password").isLength({max: 25, min: 8}).notEmpty();
    const {email, password} = req.body;
    req.getValidationResult()
        .then((result) => {
            if (!result.isEmpty()) {
                throw new APIError("Error validate data", httpStatus.BAD_REQUEST, true, result.array());
            }
        })
        .then(() => {
            const UserModel: IUserModel = keystone.list("User").model;
            return UserModel.register({email, password});
        })
        .then((user) => {
            const result = user.serialize();
            winston.debug("Register user success", {
                data: {email, password: "***"},
                result,
            });
            res.json(result);
        })
        .catch((err) => {
            if (err.type === "EmailExistsError") {
                const errors = [
                    {param: "email", msg: "E-mail is exists", value: req.body.email},
                ];
                const error = new APIError("Error validate data", httpStatus.BAD_REQUEST, true, errors);
                winston.debug("Register user failed", {
                    data: {email, password: "***"},
                    errors: (error.errors) ? error.errors : {},
                    message: error.message,
                    status: error.status,
                });
                next(error);
            } else if (err instanceof APIError) {
                winston.debug("Register user failed", {
                    data: {email, password: "***"},
                    errors: (err.errors) ? err.errors : {},
                    message: err.message,
                    status: err.status,
                });
                next(err);
            } else {
                winston.warn("Register user error", {
                    data: {email, password: "***"},
                    message: err.message,
                    stack: err.stack,
                });
                next(err);
            }
        });
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user) => {
        if (err) {
            winston.warn("User login error", {
                message: err.message,
                stack: err.stack,
            });
            return next(err);
        }
        if (!user) {
            winston.debug("User login failed");
            return res.status(401).json({
                code: "unauthorized",
                status: "error",
            });
        } else {
            const result = {
                id: user.id,
            };
            winston.debug("User login success", {result});
            return res.json({
                token: sign(result, config.jwtSecret),
            });
        }
    })(req, res, next);
});

// Authorization: Bearer <token here>
router.get("/me", (req: IRequest, res: Response, next: NextFunction) => {
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
            return res.status(200).json(result);
        } else {
            winston.debug("Authenticate user failed");
            return res.status(401).json({
                code: "unauthorized",
                status: "error",
            });
        }
    })(req, res, next);
});

export default router;
