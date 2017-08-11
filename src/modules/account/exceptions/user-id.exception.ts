
/**
 * @extends Error
 */
export default class UserIdError extends Error {
    public type: string;

    constructor(id) {
        const msg = `User not found by ID '${id}'.`;
        super(msg);
        this.message = msg;
        this.type = "UserIdError";
    }

}
