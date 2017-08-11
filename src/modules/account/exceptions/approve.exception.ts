
/**
 * @extends Error
 */
export default class ApproveError extends Error {
    public type: string;

    constructor(id: string) {
        const msg = `User \`${id}\` is nead approve.`;
        super(msg);
        this.message = msg;
        this.type = "ApproveError";
    }

}
