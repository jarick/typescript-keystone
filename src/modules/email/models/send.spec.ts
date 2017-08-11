import { expect } from "chai";
import "mocha";
import {createTransport} from "nodemailer";
import * as smtpTransport from "nodemailer-smtp-transport";
import {SMTPServer} from "smtp-server";
import config from "../../../config/config";
import keystone from "../../../index";
import load from "../email.fixture";
import {IEmailSendModel} from "./send.model";

describe("E-Mail send model", () => {
    beforeEach((done) => load(keystone.mongoose.connection, done));
    const Model: IEmailSendModel = keystone.list("EmailSend").model;

    it("should save send email", (done) => {
        const data = {
            bcc: [],
            code: "registration",
            from: "admin@email.no",
            meta: [
                {name: "code", value: "qwerty"},
            ],
            to: "admin@email.no",
        };
        Model.send(data, true)
            .then((send) => {
                try {
                    expect(send.code).to.be.equal("registration");
                    done();
                } catch (e) {
                    done(e);
                }
            }, (err) => {
                done(err);
            });
    });

    it("should set success in sent email", (done) => {
        Model.setSuccess("58f0ff272e4fb6539dc47338")
            .then((send) => {
                try {
                    expect(send.isSend).to.be.equal(true);
                    done();
                } catch (e) {
                    done(e);
                }
            }, (err) => {
                done(err);
            });
    });

    it("should set failed in sent email", (done) => {
        Model.setFailed("58f0ff272e4fb6539dc47338")
            .then((send) => {
                try {
                    expect(send.isSend).to.be.equal(false);
                    done();
                } catch (e) {
                    done(e);
                }
            }, (err) => {
                done(err);
            });
    });

    it("should send email", function(done) {
        this.timeout(10000);
        const server = new SMTPServer({
            secure: false,
            onAuth(auth, session, callback) {
                if (auth.username !== "username" || auth.password !== "pass") {
                    return callback(new Error("Invalid username or password"));
                }
                callback(undefined, {user: 1});
            },
            onData(stream, session, callback) {
                let data = "";
                stream.on("data", (response) => {
                    data += response;
                });
                stream.on("end", () => {
                    callback();
                });
            },
        });
        server.listen(8465);

        const transporter = createTransport(smtpTransport(config.smtp));
        const data = {
            bcc: [],
            code: "registration",
            from: "admin@email.no",
            meta: [
                {name: "code", value: "qwerty"},
            ],
            to: "admin@email.no",
        };
        Model.sendEmail(transporter, data)
            .then((send) => {
                try {
                    expect(typeof(send.messageId)).to.not.equal("undefined");
                    server.close(() => {
                        done();
                    });
                } catch (e) {
                    done(e);
                }
            }, (err) => {
                done(err);
            });
    });

});
