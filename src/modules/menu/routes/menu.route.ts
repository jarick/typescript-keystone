import {NextFunction, Response, Router} from "express";
import * as httpStatus from "http-status";
import * as winston from "winston";
import keystone from "../../../config/keystone";
import APIError from "../../../lib/api-error/index";
import {IRequest} from "../../../lib/request/request";
import {IMenuModel} from "../models/menu.model";
const route = Router();

route.get("/:menu", (req: IRequest, res: Response, next: NextFunction) => {
    req.checkParams("menu").notEmpty();
    const {menu} = req.params;
    req.getValidationResult()
        .then((result) => {
            if (!result.isEmpty()) {
                const error = new APIError("Menu is not set", httpStatus.BAD_REQUEST, true, result.array());
                winston.debug("Get menu failed", {
                    data: {menu},
                    errors: error.errors,
                    message: error.message,
                    status: error.status,
                });
                return next(error);
            } else {
                const MenuModel: IMenuModel = keystone.list("Menu").model;
                MenuModel.getBySlug(req.params.menu)
                    .then((data) => {
                        winston.debug("Register user success", {
                            data: {menu},
                            result: data,
                        });
                        res.json(data);
                    })
                    .catch((err) => {
                        if (err.type === "MenuNotFound") {
                            const error = new APIError(err.message, httpStatus.NOT_FOUND, true);
                            winston.debug("Get menu failed", {
                                data: {menu},
                                errors: {},
                                message: error.message,
                                status: error.status,
                            });
                            next(error);
                        } else {
                            winston.warn("Get menu error", {
                                data: {menu},
                                message: err.message,
                                stack: err.stack,
                            });
                            next(err);
                        }
                    });
            }
        });
});

export default route;
