
/**
 * @extends Error
 */
export default class BanError extends Error {
    public type: string;

    constructor(id: string) {
        const msg = `User \`${id}\` is banned.`;
        super(msg);
        this.message = msg;
        this.type = "BanError";
    }

}
