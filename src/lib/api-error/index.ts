import * as httpStatus from "http-status";
import ExtendableError from "./error";

export default class APIError extends ExtendableError {
    public errors: any;

    constructor(message: string, status: number = httpStatus.INTERNAL_SERVER_ERROR,
                isPublic: boolean = false, errors: any = []) {
        super(message, status, isPublic);
        this.errors = errors;
    }
}
