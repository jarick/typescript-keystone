import {config as dotenv} from "dotenv";
import {boolean, number, object, string, validate, ValidationErrorItem} from "joi";
import {join, resolve} from "path";

const file = (process.env.NODE_ENV === "test") ? ".env.test" : ".env";
dotenv({path: resolve(join(__dirname, "../../", file))});

const envVarsSchema = object({
    ADMIN_EMAIL: string().required()
        .description("Admin E-Mail"),
    HOST: string()
        .default("localhost"),
    JWT_SECRET: string().required()
        .description("JWT Secret required to sign"),
    MONGOOSE_DEBUG: boolean()
        .when("NODE_ENV", {
            is: string().equal("development"),
            otherwise: boolean().default(false),
            then: boolean().default(true),
        }),
    MONGO_HOST: string().required()
        .description("Mongo DB host url"),
    MONGO_PORT: number()
        .default(27017),
    NODE_ENV: string()
        .allow(["development", "production", "test", "provision"])
        .default("development"),
    PORT: number()
        .default(4040),
    SCHEMA: string()
        .valid("http", "https")
        .default("http"),
    SMTP: object().required()
        .description("SMTP config required"),
    STEAM_KEY: string().required()
        .description("Steam key"),
}).unknown()
    .required();

const {error, value: envVars} = validate(process.env, envVarsSchema);
if (error) {
    const serialize = error.details
        .map((item: ValidationErrorItem) => item.message)
        .join(", ");
    throw new Error(`Config validation error: ${serialize}`);
}
const config = {
    adminEmail: envVars.ADMIN_EMAIL,
    env: envVars.NODE_ENV,
    host: envVars.HOST,
    jwtSecret: envVars.JWT_SECRET,
    mongo: {
        host: envVars.MONGO_HOST,
        port: envVars.MONGO_PORT,
    },
    mongooseDebug: envVars.MONGOOSE_DEBUG,
    port: envVars.PORT,
    schema: envVars.SCHEMA,
    smtp: envVars.SMTP,
    steamKey: envVars.STEAM_KEY,
};

export default config;
