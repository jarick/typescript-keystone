import keystone = require("keystone");
import {ObjectID} from "bson";
import {Document, Model} from "mongoose";
import config from "../../../config/config";
import EventBus from "../../../lib/eventbus/index";
import ApproveError from "../exceptions/approve.exception";
import AuthEmailError from "../exceptions/auth-email.exception";
import AuthPasswordError from "../exceptions/auth-password.exception";
import BanError from "../exceptions/ban.exception";
import IsNotActiveError from "../exceptions/disable.exception";
import EmailExistsError from "../exceptions/email-exists.exception";
import RecoverError from "../exceptions/recover.exception";
import UserIdError from "../exceptions/user-id.exception";

export type NOT_ACTIVE = "NOT_ACTIVE";
export type SENDED_LETTER = "SENDED_LETTER";
export type ACTIVE = "ACTIVE";
export type BAN = "BAN";
export const NOT_ACTIVE = "NOT_ACTIVE";
export const SENDED_LETTER = "SENDED_LETTER";
export const ACTIVE = "ACTIVE";
export const BAN = "BAN";
export type Status = NOT_ACTIVE | SENDED_LETTER | ACTIVE | BAN;
export interface IUser extends Document {
    email: string;
    password: any;
    recover: any;
    isAdmin: boolean;
    canAccessKeystone: boolean;
    serialize: () => IUserSerialize;
    status: Status;
    _: any;
}

export interface IUserDeserialize {
    email: string;
    password: string;
}

export interface IUserSerialize {
    id: string;
    email: string;
}

export interface IUserModel extends Model<IUser> {
    register: (data: IUserDeserialize, isSendLetter?: boolean) => Promise<IUser>;
    findByEmailAndPassword: (email: string, password: string) => Promise<IUser>;
    findMeById: (id: string) => Promise<IUser>;
    remember: (id: string, isSendLetter?: boolean) => Promise<string>;
    activate: (id: string, hash: string, password?: string) => Promise<IUser>;
}

const Types = keystone.Field.Types;
const User = new keystone.List("User", {
    defaultSort: "-createdAt",
    map: { name: "email" },
});
const select = "NOT_ACTIVE, SENDED_LETTER, ACTIVE, BAN";

User.add(
    {email: {type: Types.Email, initial: true, required: true, unique: true, index: true}},
    {password: {type: Types.Password, initial: true, required: true}},
    {createdAt: { type: Date, default: Date.now, hidden: true}},
    {status: {type: Types.Select, default: ACTIVE, required: true, options: select, emptyOption: false}},
    "Permissions",
    {isAdmin: {type: Boolean, label: "Can access Keystone", index: true}},
    "Recover",
    {recover: {type: Types.Password, hidden: true, index: true}},
);

User.schema.virtual("canAccessKeystone").get(function() {
    const self: IUser = this;
    return self.isAdmin;
});

User.schema.statics.findMeById = (id: string): Promise<IUser> => {
    const UserModel: IUserModel = User.model;
    return UserModel.findById(id).exec()
        .then((user) => {
            if (!user) {
                throw new UserIdError(id);
            }
            return user;
        });
};

User.schema.statics.findByEmailAndPassword = function(email: string, password: string): Promise<IUser> {
    const UserModel: IUserModel = this;
    return UserModel.findOne({email}).exec()
        .then((user: IUser): Promise<IUser> => {
            if (!user) {
                throw new AuthEmailError(email);
            }
            if (user.status === NOT_ACTIVE) {
                throw new IsNotActiveError(user.email);
            }
            if (user.status === SENDED_LETTER) {
                throw new ApproveError(user.email);
            }
            if (user.status === BAN) {
                throw new BanError(user.email);
            }
            return new Promise((resolve, reject) => {
                user._.password.compare(password, (err: any, result: boolean) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (result) {
                            resolve(user);
                        } else {
                            reject(new AuthPasswordError(password));
                        }
                    }
                });
            });
        });
};

User.schema.statics.register = function(data: IUserDeserialize, isSendLetter: boolean = true): Promise<IUser> {
    const UserModel: IUserModel = this;
    const user: IUser = new UserModel({
        ...data,
        isAdmin: false,
        status: (isSendLetter) ? SENDED_LETTER : ACTIVE,
    });
    const email = data.email;
    return UserModel.findOne({email}).exec()
        .then((find: IUser) => {
            if (find) {
                throw new EmailExistsError(email);
            }
            if (isSendLetter) {
                const hash = new ObjectID().toHexString();
                user.recover = hash;
                const letter = {
                    bcc: [],
                    code: "registration",
                    from: process.env.ADMIN_EMAIL,
                    meta: [
                        {name: "hash", value: hash},
                    ],
                    to: user.email,
                };
                EventBus.dispatch("email:send", letter);
            }
            return user.save();
        });
};

User.schema.statics.remember = function(id: string, isSendLetter: boolean = true): Promise<string> {
    const UserModel: IUserModel = this;
    const hash = new ObjectID().toHexString();
    return UserModel.findMeById(id)
        .then((user: IUser) => {
            user.recover = hash;
            return user.save();
        })
        .then((user: IUser) => {
            if (isSendLetter) {
                const letter = {
                    bcc: [],
                    code: "recover",
                    from: config.adminEmail,
                    meta: [
                        {name: "hash", value: hash},
                    ],
                    to: user.email,
                };
                EventBus.dispatch("email:send", letter);
            }
            return user;
        })
        .then(() => hash);
};

User.schema.statics.activate = function(id: string, hash: string, password?: string): Promise<IUser> {
    const UserModel: IUserModel = this;
    return UserModel.findMeById(id)
        .then((user: IUser) => {
            return new Promise((resolve, reject) => {
                if (!user.recover) {
                    reject(new RecoverError(hash));
                } else if (user.status !== SENDED_LETTER) {
                    reject(new RecoverError(hash));
                } else {
                    user._.recover.compare(hash, (err: any, result: boolean) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (result) {
                                resolve(user);
                            } else {
                                reject(new RecoverError(hash));
                            }
                        }
                    });
                }
            });
        })
        .then((user: IUser) => {
            user.status = ACTIVE;
            return user.save();
        });
};

User.schema.methods.serialize = function(): IUserSerialize {
    return {
        email: this.email,
        id: this._id.toString(),
    };
};

User.defaultColumns = "email, isAdmin";
User.register();
