
/**
 * @extends Error
 */
export default class ExtendableError extends Error {
    public status: number;
    public isPublic: boolean;
    public isOperational: boolean;

    constructor(message: string, status: number, isPublic: boolean) {
        super(message);
        this.message = message;
        this.status = status;
        this.isPublic = isPublic;
        this.isOperational = true;
        Error.captureStackTrace(this);
    }
}
