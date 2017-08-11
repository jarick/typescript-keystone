
/**
 * @extends Error
 */
export default class AuthEmailError extends Error {
    public type: string;

    constructor(email) {
        const msg = `User by e-mail \`${email}\` is not exists.`;
        super(msg);
        this.message = msg;
        this.type = "AuthEmailError";
    }

}
