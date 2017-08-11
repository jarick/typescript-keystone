
import {IEmailSendCreate} from "../models/send.model";
export interface ISendEvent {
    type: "email:send";
    target: IEmailSendCreate;
}
