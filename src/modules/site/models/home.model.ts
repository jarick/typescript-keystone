import {Document, Model} from "mongoose";
import keystone from "../../../config/keystone";
import NotFound from "../exceptions/page.exception";

export interface IPage extends Document {
    content: string;
    meta: string[];
    name: string;
    title: string;
    slug: string;
    serialize: () => IPageSerialize;
}

export interface IPageSerialize {
    readonly content: string;
    readonly title: string;
    readonly meta: Array<{name: string, value: string}>;
}

export interface IPageModel extends Model<IPage> {
    getSingle: () => Promise<IPageSerialize>;
}

const Types = keystone.Field.Types;
const Page = new keystone.List("HomePage", {
    map: { name: "name" },
    nocreate: true,
    nodelete: true,
});

Page.add(
    {name: {type: String, initial: true, required: true, unique: true, index: true}},
    "Content",
    {title: {type: String, initial: true, required: true, index: true}},
    {content: {type: Types.Html, wysiwyg: true, required: true /*, importcss: "<path to css>" */}},
    "Meta",
    {meta: {type: Types.Meta}},
);

Page.schema.methods.serialize = function(): IPageSerialize {
    const self: IPage = this;
    return {
        content: self.content,
        meta: self.meta.map((item) => JSON.parse(item)),
        title: self.title,
    };
};

Page.schema.statics.getSingle = function(): Promise<IPageSerialize> {
    const Model: IPageModel = this;
    return Model.findOne().exec()
        .then((item?: IPage) => {
            if (!item) {
                throw new NotFound();
            }
            return item.serialize();
        });
};

Page.defaultColumns = "name";
Page.register();
