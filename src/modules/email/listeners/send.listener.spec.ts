import { expect } from "chai";
import "mocha";
import {SMTPServer} from "smtp-server";
import keystone from "../../../index";
import load from "../email.fixture";
import EventBus from "./send.listener";

describe("E-Mail send listeners", () => {
    beforeEach((done) => load(keystone.mongoose.connection, done));
    it("should send email on dispatch event", (done) => {
        const server = new SMTPServer({
            secure: false,
            onData(stream, session, callback) {
                let data = "";
                stream.on("data", (response) => {
                    data += response;
                });
                stream.on("end", () => {
                    try {
                        expect(data).to.contain("qwerty");
                    } catch (e) {
                        done(e);
                    } finally {
                        callback();
                    }
                });
            },
            onAuth(auth, session, callback) {
                if (auth.username !== "username" || auth.password !== "pass") {
                    const error = new Error("Invalid username or password");
                    done(error);
                    return callback(error);
                }
                callback(undefined, {user: 1});
            },
        });
        server.listen(8465);
        const letter = {
            bcc: [],
            code: "registration",
            from: "admin@email.no",
            meta: [
                {name: "code", value: "qwerty"},
            ],
            to: "admin@email.no",
        };
        EventBus.dispatch("email:send", letter);
        EventBus.addEventListener("email:info", () => {
            server.close(() => {
                done();
            });
        });
    });

});
