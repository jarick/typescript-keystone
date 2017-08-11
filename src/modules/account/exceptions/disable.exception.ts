
/**
 * @extends Error
 */
export default class IsNotActiveError extends Error {
    public type: string;

    constructor(id: string) {
        const msg = `User \`${id}\` is not active.`;
        super(msg);
        this.message = msg;
        this.type = "IsNotActiveError";
    }

}
