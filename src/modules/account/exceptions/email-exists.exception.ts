
/**
 * @extends Error
 */
export default class EmailExistsError extends Error {
    public type: string;

    constructor(email: string) {
        const msg = `E-mail '${email}' is exists.`;
        super(msg);
        this.message = msg;
        this.type = "EmailExistsError";
    }

}
