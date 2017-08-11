import {render} from "ejs";
import {Document, Model} from "mongoose";
import {createTransport, SentMessageInfo, Transporter} from "nodemailer";
import * as smtpTransport from "nodemailer-smtp-transport";
import config from "../../../config/config";
import keystone from "../../../config/keystone";
import EventBus from "../../../lib/eventbus/index";
import {IEmailTemplateModel} from "./template.model";

export interface IEmailSend extends Document {
    bcc: string[];
    code: string;
    from: string;
    isSend?: boolean;
    meta: Array<{name: string, value: string}>;
    to: string;
    serialize: () => IEmailSendCreate;
}

export interface IEmailSendCreate {
    bcc: string[];
    code: string;
    from: string;
    meta: Array<{name: string, value: string}>;
    to: string;
}

export interface IEmailSendModel extends Model<IEmailSend> {
    send: (data: IEmailSendCreate, isSend: boolean | null) => Promise<IEmailSend>;
    setSuccess: (id: string) => Promise<IEmailSend>;
    setFailed: (id: string) => Promise<IEmailSend>;
    sendEmail: (transporter: Transporter, model: IEmailSendCreate) => Promise<SentMessageInfo>;
}

const Types = keystone.Field.Types;
const EmailSend = new keystone.List("EmailSend", {
    defaultSort: "-createdAt",
    map: { name: "code" },
    nocreate: true,
    nodelete: true,
});

EmailSend.add(
    {createdAt: { type: Date, default: Date.now, hidden: true}},
    {code: {type: String, initial: true, required: true, index: true}},
    {from: {type: String, initial: true, required: true, index: true}},
    {to: {type: String, initial: true, required: true, index: true}},
    {isSend: {type: Boolean, index: true}},
    "Bcc",
    {bcc: {type: Types.TextArray}},
    "Meta",
    {meta: {type: Types.Meta}},
);

EmailSend.schema.methods.serialize = function(): IEmailSendCreate {
    return {
        bcc: this.bcc,
        code: this.code,
        from: this.from,
        meta: this.meta.map((item) => JSON.parse(item)),
        to: this.to,
    };
};

EmailSend.schema.statics.send = (data: IEmailSendCreate, isSend: boolean | null = null): Promise<IEmailSend> => {
    const Model: IEmailSendModel = keystone.list("EmailSend").model;
    const send = new Model({
        ...data,
        isSend,
        meta: data.meta.map((item) => {
            return JSON.stringify(item);
        }),
    });
    return send.save();
};

EmailSend.schema.statics.setSuccess = (id: string): Promise<IEmailSend> => {
    const Model: IEmailSendModel = keystone.list("EmailSend").model;
    return Model.findByIdAndUpdate(id, { isSend: true }, {new: true}).exec();
};

EmailSend.schema.statics.setFailed = (id: string): Promise<IEmailSend> => {
    const Model: IEmailSendModel = keystone.list("EmailSend").model;
    return Model.findByIdAndUpdate(id, { isSend: false }, {new: true}).exec();
};

EmailSend.schema.post("save", (doc: IEmailSend, done: (err?: any) => void) => {
    if (doc.isSend === null) {
        const Model: IEmailSendModel = keystone.list("EmailSend").model;
        const transporter = createTransport(smtpTransport(config.smtp));
        Model.sendEmail(transporter, doc.serialize())
            .then(() => {
                return Model.setSuccess(doc._id)
                    .then((info) => {
                        EventBus.dispatch("email:info", info);
                        done();
                        return info;
                    });
            }, (err) => {
                return Model.setFailed(doc._id)
                    .then(() => {
                        done();
                    });
            });
    } else {
        done();
    }
});

const sendEmail = (transporter: Transporter, model: IEmailSendCreate): Promise<SentMessageInfo> => {
    const EmailTemplate: IEmailTemplateModel = keystone.list("EmailTemplate").model;
    return EmailTemplate.get(model.code)
        .then((template) => {
            const meta = model.meta.reduce((result, item) => {
                result[item.name] = item.value;
                return result;
            }, {});
            const mailOptions = {
                from: model.from,
                html: render(template.html, meta),
                subject: render(template.subject, meta),
                to: model.to,
            };
            return new Promise<SentMessageInfo>((resolve, reject) => {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(info);
                    }
                });
            });
        });
};
EmailSend.schema.statics.sendEmail = sendEmail;

EmailSend.defaultColumns = "code, from, to";
EmailSend.register();
