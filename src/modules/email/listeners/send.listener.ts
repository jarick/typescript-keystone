import * as winston from "winston";
import keystone from "../../../config/keystone";
import EventBus from "../../../lib/eventbus/index";
import {ISendEvent} from "../events/send.event";
import {IEmailSendModel} from "../models/send.model";

EventBus.addEventListener("email:send", (event: ISendEvent) => {
    const EmailSend: IEmailSendModel = keystone.list("EmailSend").model;
    EmailSend.send(event.target, null).then((result) => {
        winston.debug("E-Mail send success", {
            result: result.serialize(),
        });
    }, (err) => {
        winston.warn("E-Mail send failed", {
            message: err.message,
            stack: err.stack,
        });
    });
});

export default EventBus;
