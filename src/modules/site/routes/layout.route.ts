import {NextFunction, Response, Router} from "express";
import * as httpStatus from "http-status";
import * as winston from "winston";
import keystone from "../../../config/keystone";
import APIError from "../../../lib/api-error/index";
import {IRequest} from "../../../lib/request/request";
import NotFound from "../exceptions/page.exception";
import {ILayoutModel} from "../models/layout.model";
const route = Router();

route.get("/", (req: IRequest, res: Response, next: NextFunction) => {
    const LayoutModel: ILayoutModel = keystone.list("SiteLayout").model;
    LayoutModel.getSingle()
        .then((data) => {
            winston.debug("Get layout success", {
                result: data,
            });
            res.json(data);
        })
        .catch((err) => {
            if (err instanceof NotFound) {
                const error = new APIError(err.message, httpStatus.NOT_FOUND, true);
                winston.debug("Get layout failed", {
                    errors: {},
                    message: error.message,
                    status: error.status,
                });
                next(error);
            } else if (err instanceof APIError) {
                winston.debug("Get layout failed", {
                    errors: err.errors,
                    message: err.message,
                    status: err.status,
                });
                next(err);
            } else {
                winston.warn("Get layout error", {
                    message: err.message,
                    stack: err.stack,
                });
                next(err);
            }
        });
});

export default route;
