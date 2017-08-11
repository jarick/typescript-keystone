
/**
 * @extends Error
 */
export default class NotFound extends Error {

    constructor() {
        const msg = `Page is not exists.`;
        super(msg);
        this.message = msg;
    }

}
