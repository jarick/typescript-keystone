import {Request} from "express";
import {IUser} from "../../modules/account/models/user.model";
import ExpressValidator = require("express-validator");

export interface IRequest extends Request, ExpressValidator.RequestValidation {
    user?: IUser;
    session: any;
}
