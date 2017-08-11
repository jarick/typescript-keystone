import {Document, Model} from "mongoose";
import keystone from "../../../config/keystone";
import NotFound from "../exceptions/page.exception";

export interface ILayout extends Document {
    icon: string;
    name: string;
    slug: string;
    serialize: () => ILayoutSerialize;
}

export interface ILayoutSerialize {
    readonly name: string;
    readonly icon: string;
}

export interface ILayoutModel extends Model<ILayout> {
    getSingle: () => Promise<ILayoutSerialize>;
}

const Types = keystone.Field.Types;
const Layout = new keystone.List("SiteLayout", {
    map: { name: "name" },
    nocreate: true,
    nodelete: true,
});

Layout.add(
    {name: {type: String, initial: true, required: true, unique: true, index: true}},
    {code: {type: Types.Key, initial: true, required: true, unique: true, index: true}},
    {icon: {type: String, initial: true}},
);

Layout.schema.methods.serialize = function(): ILayoutSerialize {
    const self: ILayout = this;
    return {
        icon: self.icon,
        name: self.name,
    };
};

Layout.schema.statics.getSingle = function(): Promise<ILayoutSerialize> {
    const LayoutModel: ILayoutModel = this;
    return LayoutModel.findOne().exec()
        .then((item?: ILayout) => {
            if (!item) {
                throw new NotFound();
            }
            return item.serialize();
        });
};

Layout.defaultColumns = "name";
Layout.register();
