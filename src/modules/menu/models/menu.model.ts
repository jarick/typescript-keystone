import {Document, Model} from "mongoose";
import keystone from "../../../config/keystone";
import MenuNotFound from "../exceptions/menu.exception";

export interface IMenuItemSerialize {
    href: string;
    id: string;
    path: string;
    title: string;
}

export interface IMenu extends Document {
    name: string;
    slug: string;
    description: string;
    active: boolean;
    items: IMenuItemSerialize[];
    serialize: () => IMenuSerialize;
}

export interface IMenuSerialize {
    readonly name: string;
    readonly slug: string;
    items: ReadonlyArray<IMenuItemSerialize>;
}

export interface IMenuModel extends Model<IMenu> {
    getBySlug: (menu: string) => Promise<IMenuSerialize>;
}

const Types = keystone.Field.Types;
const Menu = new keystone.List("Menu", {
    autokey: { path: "slug", from: "name", unique: true },
    defaultSort: "-createdAt",
    map: { name: "name" },
});

Menu.add({
    active: {type: Boolean, default: true, index: true},
    createdAt: { type: Date, default: Date.now, hidden: true},
    items: {type: Types.Menu, default: []},
    name: {type: String, initial: true, required: true, unique: true, index: true},
});

Menu.schema.methods.serialize = function(): IMenuSerialize {
    const self: IMenu = this;
    const find = (items: IMenuItemSerialize[], path: string) => {
        return items
            .filter((item) => item.path === path)
            .map((item) => {
                const pathNext = path.split("#").concat(item.id).filter((str) => str !== "").join("#");
                return {
                    href: item.href,
                    items: find(items, pathNext),
                    title: item.title,
                };
            });
    };
    return {
        items: find(self.items, ""),
        name: self.name,
        slug: self.slug,
    };
};

Menu.schema.statics.getBySlug = function(slug: string): Promise<IMenuSerialize> {
    const MenuModel: IMenuModel = this;
    return MenuModel.findOne({slug}).exec()
        .then((item: IMenu) => {
            if (!item) {
                throw new MenuNotFound(slug);
            }
            return item.serialize();
        });
};

Menu.defaultColumns = "name";
Menu.register();
