
/**
 * @extends Error
 */
export default class RecoverError extends Error {
    public type: string;

    constructor(hash: string) {
        const msg = `Bad hash '${hash}'.`;
        super(msg);
        this.message = msg;
        this.type = "RecoverError";
    }

}
