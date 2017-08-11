import keystone = require("keystone");
import menu = require("../../keystone/fields/types/menu/MenuType");
import meta = require("../../keystone/fields/types/meta/MetaType");
import config from "./config";

Object.defineProperty(keystone.Field.Types, "Menu", {get() { return menu; } });
Object.defineProperty(keystone.Field.Types, "Meta", {get() { return meta; } });

keystone.init({
    "admin path": "admin",
    "auth": false,
    "auto update": false,
    "brand": "GILD cs",
    "cookie secret": config.jwtSecret,
    "name": "Bitcoins",
    "session": false,
    "user model": "User",
});

export default keystone;
