
/**
 * @extends Error
 */
export default class MenuNotFound extends Error {
    public type: string;

    constructor(menu: string) {
        const msg = `Menu \`${menu}\` is not found.`;
        super(msg);
        this.message = msg;
        this.type = "MenuNotFound";
    }

}
