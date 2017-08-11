import {NextFunction, Response, Router} from "express";
import * as httpStatus from "http-status";
import * as winston from "winston";
import keystone from "../../../config/keystone";
import APIError from "../../../lib/api-error/index";
import {IRequest} from "../../../lib/request/request";
import NotFound from "../exceptions/page.exception";

const route = Router();
const config = {
    help: "HelpPage",
    home: "HomePage",
    settings: "SettingsPage",
};

route.get("/:page", (req: IRequest, res: Response, next: NextFunction) => {
    req.checkParams("page").isAlpha().notEmpty();
    const {page} = req.params;
    req.getValidationResult()
        .then((result) => {
            if (!result.isEmpty()) {
                const error = new APIError("Error validate data", httpStatus.BAD_REQUEST, true, result.array());
                winston.debug("Get page failed", {
                    data: {page},
                    errors: error.errors,
                    message: error.message,
                    status: error.status,
                });
                next(error);
            } else {
                const Model = keystone.list(config[req.params.page]).model;
                Model.getSingle()
                    .then((data) => {
                        winston.debug("Get page success", {
                            data: {page},
                            result: data,
                        });
                        res.json(data);
                    })
                    .catch((err) => {
                        if (err instanceof NotFound) {
                            const error = new APIError(err.message, httpStatus.NOT_FOUND, true);
                            winston.debug("Get page failed", {
                                data: {page},
                                errors: {},
                                message: error.message,
                                status: error.status,
                            });
                            next(error);
                        } else if (err instanceof APIError) {
                            winston.debug("Get page failed", {
                                data: {page},
                                errors: err.errors,
                                message: err.message,
                                status: err.status,
                            });
                            next(err);
                        } else {
                            winston.warn("Get page error", {
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
