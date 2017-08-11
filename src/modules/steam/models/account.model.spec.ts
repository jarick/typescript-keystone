import { expect } from "chai";
import "mocha";
import keystone from "../../../index";
import load from "../steam.fixture";
import {IGetInventoriesOptions, ISteamAccount, ISteamAccountModel, ISteamAccountSerialize} from "./account.model";

// getByUser: (id: string) => Promise<ISteamAccount[]>;
// add: (data: ISteamAccountSerialize) => Promise<ISteamAccount>;
describe("Steam account model", () => {
    beforeEach((done) => load(keystone.mongoose.connection, done));
    const SteamAccount: ISteamAccountModel = keystone.list("SteamAccount").model;

    it("should return users by user guid", (done) => {
        SteamAccount.getByUser("5833ea6724b417485def0ac1")
            .then((users: ISteamAccount[]) => {
                try {
                    expect(users.length).to.be.equal(1);
                    done();
                } catch (e) {
                    done(e);
                }
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it("should create new user steam account", (done) => {
        const data: ISteamAccountSerialize = {
            avatar: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/" +
            "avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg",
            avatarfull: "https://steamcdn-a.akamaihd.net/steamcommunity/public/" +
            "images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
            avatarmedium: "https://steamcdn-a.akamaihd.net/steamcommunity/public/" +
            "images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg",
            personaname: "jarick",
            profileurl: "http://steamcommunity.com/profiles/76561198180806406/",
            steamid: "26561198180806406",
            user: "5833ea6724b417485def0ac1",
        };
        SteamAccount.add(data)
            .then((user: ISteamAccount) => {
                try {
                    expect(user.serialize()).to.have.property("steamid", "26561198180806406");
                    expect(user.serialize()).to.have.property("user", "5833ea6724b417485def0ac1");
                    expect(user._id.toString()).to.not.equal("99f0ea6724b417485def0acb");
                    done();
                } catch (e) {
                    done(e);
                }
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it("should update user steam account", (done) => {
        const data: ISteamAccountSerialize = {
            avatar: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/" +
            "avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg",
            avatarfull: "https://steamcdn-a.akamaihd.net/steamcommunity/public/" +
            "images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
            avatarmedium: "https://steamcdn-a.akamaihd.net/steamcommunity/public/" +
            "images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg",
            personaname: "jarick",
            profileurl: "http://steamcommunity.com/profiles/76561198180806406/",
            steamid: "76561198180806406",
            user: "5833ea6724b417485def0ac1",
        };
        SteamAccount.add(data)
            .then((user: ISteamAccount) => {
                try {
                    expect(user.serialize()).to.have.property("steamid", "76561198180806406");
                    expect(user.serialize()).to.have.property("user", "5833ea6724b417485def0ac1");
                    expect(user._id.toString()).to.be.equal("99f0ea6724b417485def0acb");
                    done();
                } catch (e) {
                    done(e);
                }
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it("should return array of steam id for user", (done) => {
        SteamAccount.getStemIdsByUserId("5833ea6724b417485def0ac1")
            .then((ids: string[]) => {
                try {
                    expect(ids).to.deep.equal(["76561198180806406"]);
                    done();
                } catch (e) {
                    done(e);
                }
            }, (err) => {
                done(err);
            });
    });

    it("should return inventories by steam id", (done) => {
        const steam = new SteamAccount({
            avatar: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/" +
            "avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg",
            avatarfull: "https://steamcdn-a.akamaihd.net/steamcommunity/public/" +
            "images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
            avatarmedium: "https://steamcdn-a.akamaihd.net/steamcommunity/public/" +
            "images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg",
            personaname: "jarick",
            profileurl: "http://steamcommunity.com/profiles/76561198180806406/",
            steamid: "76561198180806406",
            user: "5833ea6724b417485def0ac1",
        });
        const options: IGetInventoriesOptions = {
            app: 730,
            context: 2,
            count: 5000,
            lang: "russian",
        };
        steam.getInventories(options)
            .then((json: any) => {
                try {
                    expect(json.success).to.equal(1);
                    done();
                } catch (e) {
                    done(e);
                }
            }, (err) => {
                done(err);
            });
    });

    it("should return steam account by user id and steam id", (done) => {
        SteamAccount.getAccountByUserIdAndSteamId("5833ea6724b417485def0ac1", "76561198180806406")
            .then((account) => {
                try {
                    expect(account.personaname).to.equal("jarick");
                    done();
                } catch (e) {
                    done(e);
                }
            }, (err) => {
                done(err);
            });
    });

});
