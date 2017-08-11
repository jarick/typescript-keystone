
/**
 * @extends Error
 */
export default class AccessInvestoryError extends Error {
    public type: string;

    constructor(id: string) {
        const msg = `Access to steam user profile \`${id}\` is denied.`;
        super(msg);
        this.message = msg;
        this.type = "AccessInvestoryError";
    }

}
