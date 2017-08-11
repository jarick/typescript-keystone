import {IEmailSend} from "../models/send.model";

export interface IInfoEvent {
    target: IEmailSend;
    type: "email:info";
}
