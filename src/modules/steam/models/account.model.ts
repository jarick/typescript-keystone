import {Document, Model} from "mongoose";
import * as request from "request";
import keystone from "../../../config/keystone";
import SteamAccountError from "../exceptions/account.exception";
import AccessInvestoryError from "../exceptions/investory.exception";

export interface IGetInventoriesOptions {
    app: number;
    context: number;
    lang: string;
    count: number;
}

export interface ISteamAccount extends Document {
    user: string;
    steamid: string;
    avatar: string;
    personaname: string;
    profileurl: string;
    avatarmedium: string;
    avatarfull: string;
    serialize: () => ISteamAccountSerialize;
    getInventories: (options: IGetInventoriesOptions) => Promise<any>;
}

export interface ISteamAccountSerialize {
    readonly user: string;
    readonly steamid: string;
    readonly avatar: string;
    readonly personaname: string;
    readonly profileurl: string;
    readonly avatarmedium: string;
    readonly avatarfull: string;
}

export interface ISteamAccountModel extends Model<ISteamAccount> {
    getByUser: (id: string) => Promise<ISteamAccount[]>;
    add: (data: ISteamAccountSerialize) => Promise<ISteamAccount>;
    getAccountByUserIdAndSteamId: (userId: string, steamId: string) => Promise<ISteamAccount>;
    getStemIdsByUserId: (userId: string) => Promise<string[]>;
}

const Types = keystone.Field.Types;
const SteamAccount = new keystone.List("SteamAccount", {
    map: { name: "personaname" },
    nocreate: true,
});

SteamAccount.add(
    {user: {type: String, initial: true, required: true, index: true}},
    {steamid: {type: String, initial: true, required: true, index: true}},
    {personaname: {type: String, initial: true, required: true, index: true}},
    {avatar: {type: Types.Url}},
    {avatarmedium: {type: Types.Url}},
    {avatarfull: {type: Types.Url}},
    {profileurl: {type: Types.Url}},
);

SteamAccount.schema.methods.serialize = function(): ISteamAccountSerialize {
    const self: ISteamAccount = this;
    return {
        avatar: self.avatar,
        avatarfull: self.avatarfull,
        avatarmedium: self.profileurl,
        personaname: self.personaname,
        profileurl: self.profileurl,
        steamid: self.steamid,
        user: self.user,
    };
};

SteamAccount.schema.statics.getByUser = function(id: string): Promise<ISteamAccount[]> {
    const self: ISteamAccountModel = this;
    return self.find({user: id}).exec();
};

SteamAccount.schema.statics.add = function(data: ISteamAccountSerialize): Promise<ISteamAccount> {
    const self: ISteamAccountModel = this;
    const options = {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
    };
    const query = {
        steamid: data.steamid,
    };
    return self.findOneAndUpdate(query, data, options).exec();
};

SteamAccount.schema.statics.getStemIdsByUserId = function(userId: string): Promise<string[]> {
    const self: ISteamAccountModel = this;
    return self.find({user: userId}).exec()
        .then((accounts: ISteamAccount[]) => {
            return  accounts.reduce((result: string[], item: ISteamAccount) => {
                return result.concat([item.steamid]);
            }, []);
        });
};

const getAccountByUserIdAndSteamId = function(userId: string, steamId: string): Promise<ISteamAccount> {
    const self: ISteamAccountModel = this;
    return self.findOne({user: userId, steamid: steamId}).exec()
        .then((account) => {
            if (!account) {
                throw new SteamAccountError(steamId);
            }
            return account;
        });
};
SteamAccount.schema.statics.getAccountByUserIdAndSteamId = getAccountByUserIdAndSteamId;

const getInventories = function(options: IGetInventoriesOptions): Promise<any> {
    const self: ISteamAccount = this;
    const url = `https://steamcommunity.com/inventory/${self.steamid}`
        + `/${options.app}/${options.context}?l=${options.lang}&count=${options.count}`;
    return new Promise((resolve, reject) => {
        request(url, (err, response) => {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        });
    })
        .then((response: any) => {
            const json = JSON.parse(response.body);
            if (!json.success) {
                throw new AccessInvestoryError(self.steamid);
            }
            return json;
        });
};
SteamAccount.schema.methods.getInventories = getInventories;

SteamAccount.schema.index({ user: 1, steamid: 1}, { unique: true });

SteamAccount.defaultColumns = "personaname";
SteamAccount.register();
