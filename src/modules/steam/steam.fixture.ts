import fixtures = require("pow-mongoose-fixtures");
import {ObjectID} from "bson";

export default function load(db: any, done: (err: any) => void) {
    fixtures.load({
        SteamAccount: [
            {
                _id: new ObjectID("99f0ea6724b417485def0acb"),
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
            },
        ],
    }, db, done);
}
