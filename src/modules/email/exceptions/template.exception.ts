
/**
 * @extends Error
 */
export default class TemplateNotFoundError extends Error {
    public type: string;

    constructor(code: string) {
        const msg = `Template by code \`${code}\` is not exists.`;
        super(msg);
        this.message = msg;
        this.type = "TemplateNotFoundError";
    }

}
