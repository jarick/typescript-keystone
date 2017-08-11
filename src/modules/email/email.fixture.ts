import fixtures = require("pow-mongoose-fixtures");
import {ObjectID} from "bson";

export default function load(db: any, done: (err: any) => void) {
    fixtures.load({
        EmailSend: [
            {
                _id: new ObjectID("58f0ff272e4fb6539dc47338"),
                bbc: [],
                code: "registration",
                from: "admin@email.no",
                isSend: true,
                meta: [
                    `{"name":"code","value":"qwerty"}`,
                ],
                to: "admin@email.no",
            },
        ],
        EmailTemplate: [
            {
                code: "registration",
                html: "<div>Registration hash: <%- code %></div>",
                name: "Registration letter",
                subject: "Registration E-Mail",
            },
            {
                code: "remember",
                html: "<div>Remember hash: <%- code %></div>",
                name: "Remember letter",
                subject: "Remember E-Mail",
            },
        ],
    }, db, done);
}
