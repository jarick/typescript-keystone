
/**
 * @extends Error
 */
export default class SteamAccountError extends Error {
    public type: string;

    constructor(id: string) {
        const msg = `Steam account \`${id}\` is not found.`;
        super(msg);
        this.message = msg;
        this.type = "SteamAccountError";
    }

}
