import fixtures = require("pow-mongoose-fixtures");
import {ObjectID} from "bson";

export default function load(db: any, done: (err: any) => void) {
    fixtures.load({
        User: [
            {
                _id: new ObjectID("58f0ea6724b417485def0acb"),
                email : "admin@email.no",
                isAdmin : true,
                password : "qwerty",
                recover: "hash",
                status: "ACTIVE",
            },
            {
                _id: new ObjectID("58f0ea6724b417485def0ac1"),
                email : "admin1@email.no",
                isAdmin : true,
                password : "qwerty",
                recover: "hash",
                status: "NOT_ACTIVE",
            },
            {
                _id: new ObjectID("58f0ea6724b417485def0ac2"),
                email : "admin2@email.no",
                isAdmin : true,
                password : "qwerty",
                recover: "hash",
                status: "SENDED_LETTER",
            },
            {
                _id: new ObjectID("58f0ea6724b417485def0ac3"),
                email : "admin3@email.no",
                isAdmin : true,
                password : "qwerty",
                recover: "hash",
                status: "BAN",
            },
        ],
    }, db, done);
}
