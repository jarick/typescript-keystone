
/**
 * @extends Error
 */
export default class AuthPasswordError extends Error {
    public type: string;

    constructor(password) {
        const msg = `Bad password '${password}'.`;
        super(msg);
        this.message = msg;
        this.type = "AuthPasswordError";
    }

}
