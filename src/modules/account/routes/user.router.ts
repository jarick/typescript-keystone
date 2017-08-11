import {NextFunction, Request, Response, Router} from "express";
import {model} from "mongoose";
import APIError from "../../../lib/api-error/index";
import {IUser, IUserModel} from "../models/user.model";

const router = Router();

router.post("/register", (req: Request, res: Response, next: NextFunction) => {
    req.checkBody("email").isEmail().notEmpty();
    req.checkBody("password").isLength({max: 25, min: 8}).notEmpty();
    req.getValidationResult()
        .then((result) => {
           if (!result.isEmpty()) {
               throw new APIError("Error validate data", httpStatus.BAD_REQUEST, true, result.array());
           }
        })
        .then(() => {
            const UserModel = model<IUser, IUserModel>("User");
            return UserModel.register(req.body);
        })
        .then((user) => {
            res.json(user.serialize());
        })
        .catch((err) => next(err));
});

export default router;
