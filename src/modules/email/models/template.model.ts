import keystone = require("keystone");
import {Document, Model} from "mongoose";
import TemplateNotFoundError from "../exceptions/template.exception";

export interface IEmailTemplate extends Document {
    name: string;
    code: string;
    html: string;
    subject: string;
}

export interface IEmailTemplateModel extends Model<IEmailTemplate> {
    get: (code: string) => Promise<IEmailTemplate>;
}

const Types = keystone.Field.Types;
const EmailTemplate = new keystone.List("EmailTemplate");

EmailTemplate.add(
    {name: {type: String, initial: true, required: true, index: true}},
    {code: {type: Types.Key, initial: true, required: true, unique: true, index: true}},
    {subject: {type: String, initial: true, required: true}},
    "Content",
    {html: {type: Types.Html, wyswig: true, initial: true, required: true}},
);

EmailTemplate.schema.statics.get = (code: string) => {
    const Model: IEmailTemplateModel = keystone.list("EmailTemplate").model;
    return Model.findOne({ code }).exec()
        .then((template: IEmailTemplate) => {
            if (!template) {
                throw new TemplateNotFoundError(code);
            }
            return template;
        });
};

EmailTemplate.defaultColumns = "name, code";
EmailTemplate.register();
