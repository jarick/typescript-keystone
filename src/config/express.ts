import * as bodyParser from "body-parser";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as express from "express";
import * as session from "express-session";
import expressValidator = require("express-validator");
import * as helmet from "helmet";
import * as httpStatus from "http-status";
import * as methodOverride from "method-override";
import * as logger from "morgan";
import {join, resolve} from "path";
import config from "./config";
import passport from "./passport";
import {stream} from "./winston";
import RequestValidation = ExpressValidator.RequestValidation;
import {NextFunction, Request, Response, static as publicFiles} from "express";
import APIError from "../lib/api-error/index";
import routes from "./routes";

const app: express.Application = express();

if (config.env === "development") {
    app.use(logger("dev"));
}
app.use(publicFiles(resolve(join(__dirname, "../../../public"))));
app.use(bodyParser.json());
app.use(cookieParser(config.jwtSecret));
app.use(session({
    name: "sessionId",
    resave: true,
    saveUninitialized: true,
    secret: config.jwtSecret,
}));
app.use((req, res, next) => {
  req.user = {
    id: 1,
    canAccessKeystone: true,
    get() {
      return "(no name)";
    },
  };
  next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator());
app.use(compress());
app.use(methodOverride());
app.use(helmet());
app.use(cors());
if (config.env === "development") {
    app.use(logger("combined", {
        stream,
    }));
}
app.all("/", (req: RequestValidation, res: Response) => res.json({status: "ok"}));
app.use("/", routes);
if (config.env !== "test") {
    logger("combined", {
        skip(req: Request, res: Response): boolean {
            return res.statusCode < 400;
        },
        stream,
    });
}
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (!(err instanceof APIError)) {
        err = new APIError(err.message, err.status, err.isPublic);
    }
    res.status(err.status).json({
        errors: err.errors ? err.errors : null,
        message: err.isPublic ? err.message : httpStatus[err.status],
        stack: config.env === "development" ? err.stack : {},
        type: err.isPublic ? err.type : httpStatus[err.status],
    });
});

export default app;
