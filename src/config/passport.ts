import {verify} from "jsonwebtoken";
import * as passport from "passport";
import {Strategy as BearerStrategy} from "passport-http-bearer";
import {Strategy as LocalStrategy} from "passport-local";
import {Strategy as SteamStrategy} from "passport-steam";
import {Strategy} from "passport-strategy";
import {IRequest} from "../lib/request/request";
import {IUser, IUserModel} from "../modules/account/models/user.model";
import {ISteamAccountModel} from "../modules/steam/models/account.model";
import config from "./config";
import keystone from "./keystone";
type LocalFunction = (err: any, result: IUser|false) => void;
type DoneFunction = (err: any, user?: any) => void;

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

const localOptions = {
    passReqToCallback: true,
    passwordField: "password",
    session: false,
    usernameField: "email",
};
const localFunc = (req: IRequest, email: string, password: string, cb: LocalFunction) => {
    const UserModel: IUserModel = keystone.list("User").model;
    UserModel.findByEmailAndPassword(email, password)
        .then((user: IUser) => {
            return cb(null, user);
        })
        .catch(() => {
            return cb(null, false);
        });
};
export const localStrategy = new LocalStrategy(localOptions, localFunc);
passport.use("local", localStrategy);

const bearerFunc = (token: string, cb: LocalFunction) => {
    const UserModel: IUserModel = keystone.list("User").model;
    verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            return cb(err, false);
        }
        UserModel.findMeById(decoded.id)
            .then((user) => {
                cb(null, user);
            })
            .catch(() => {
                cb(null, false);
            });
    });
};
export const bearerStrategy = new BearerStrategy(bearerFunc);
passport.use("bearer", bearerStrategy);

const steamOptions = {
    apiKey: config.steamKey,
    passReqToCallback: true,
    realm: `${config.schema}://${config.host}:${config.port}/`,
    returnURL: `${config.schema}://${config.host}:${config.port}/api/v1/steam/account/return`,
    session: false,
};
const steamFunc = (req: IRequest, identifier: string, profile: any, done: DoneFunction) => {
    const SteamAccount: ISteamAccountModel = keystone.list("SteamAccount").model;
    const UserModel: IUserModel = keystone.list("User").model;
    const userId = req.session.userid;
    if (!userId) {
        return done(new Error("User id is not set"));
    }
    UserModel.findMeById(userId)
        .then((user) => {
            return SteamAccount.add({
                avatar: profile.photos[0].value,
                avatarfull: profile.photos[2].value,
                avatarmedium: profile.photos[1].value,
                personaname: profile.displayName,
                profileurl: identifier,
                steamid: profile.id,
                user: user._id.toString(),
            });
        })
        .then(() => {
            profile.identifier = identifier;
            return done(null, profile);
        })
        .catch((err: any) => {
            done(err);
        });
};
export const steamStrategy = new SteamStrategy(steamOptions, steamFunc);
passport.use("steam", steamStrategy);

class CustomStrategy extends Strategy {
    public authenticate(req: IRequest) {
        const UserModel: IUserModel = keystone.list("User").model;
        UserModel.findOne().exec()
            .then((user: IUser) => {
                this.success(user, {});
            })
            .catch((err) => {
                this.fail(err, 500);
            });
    }
}
export const customStrategy = new CustomStrategy();
passport.use("test", customStrategy);

export default passport;
