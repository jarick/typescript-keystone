import app from "./config/express";
import keystone from "./config/keystone";
import routes = require("../keystone/admin/server/index");

keystone.app = app;
app.use(routes.createStaticRouter(keystone));
app.use(routes.createDynamicRouter(keystone));
keystone.start();

export default keystone;
