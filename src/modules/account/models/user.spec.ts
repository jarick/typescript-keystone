import { expect } from "chai";
import "mocha";
import keystone from "../../../index";
import load from "../account.fixture";
import {ACTIVE, IUser, IUserDeserialize, IUserModel} from "./user.model";

describe("User model", () => {
    beforeEach((done) => load(keystone.mongoose.connection, done));
    const User: IUserModel = keystone.list("User").model;
    it("should return user by email and password", (done) => {
        User.findByEmailAndPassword("admin@email.no", "qwerty")
            .then((user) => {
                const json = user.serialize();
                expect(json).to.deep.equal({
                    email: "admin@email.no",
                    id: "58f0ea6724b417485def0acb",
                });
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it("should return except 'Email is not find'", (done) => {
        User.findByEmailAndPassword("admin22@email.no", "qwerty")
            .then(() => {
                done("User is return, but need except error");
            }, (err) => {
                try {
                    expect(err.type).to.equal("AuthEmailError");
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it("should return except error 'Password not find'", (done) => {
        User.findByEmailAndPassword("admin@email.no", "qwerty2")
            .then(() => {
                done("User is return, but need except error");
            }, (err) => {
                try {
                    expect(err.type).to.equal("AuthPasswordError");
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it("should return except error 'User is not active'", (done) => {
        User.findByEmailAndPassword("admin1@email.no", "qwerty")
            .then(() => {
                done("User is return, but need except error");
            }, (err) => {
                try {
                    expect(err.type).to.equal("IsNotActiveError");
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it("should return except error 'User is not approve'", (done) => {
        User.findByEmailAndPassword("admin2@email.no", "qwerty")
            .then(() => {
                done("User is return, but need except error");
            }, (err) => {
                try {
                    expect(err.type).to.equal("ApproveError");
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it("should return except error 'User is banned'", (done) => {
        User.findByEmailAndPassword("admin3@email.no", "qwerty")
            .then(() => {
                done("User is return, but need except error");
            }, (err) => {
                try {
                    expect(err.type).to.equal("BanError");
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it("should return user by id", (done) => {
        User.findMeById("58f0ea6724b417485def0acb")
            .then((user) => {
                const json = user.serialize();
                expect(json).to.deep.equal({
                    email: "admin@email.no",
                    id: "58f0ea6724b417485def0acb",
                });
                done();
            }, (err) => {
                done(err);
            });
    });

    it("should except error 'User is not found'", (done) => {
        User.findMeById("58f0ea6724b418485def0ac2")
            .then(() => {
                done("User is return, but need except error");
            }, (err) => {
                try {
                    expect(err.type).to.equal("UserIdError");
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it("should register new user", (done) => {
        const data: IUserDeserialize = {
            email: "admin23@email.no",
            password: "qwerty",
        };
        User.register(data, false)
            .then((user: IUser) => {
                const json = user.serialize();
                try {
                    expect(json).to.have.property("email", "admin23@email.no");
                    done();
                } catch (e) {
                    done(e);
                }
            }, (err) => {
                done(err);
            });
    });

    it("should except error 'E-mail is exists'", (done) => {
        const data: IUserDeserialize = {
            email: "admin@email.no",
            password: "qwerty",
        };
        User.register(data, false)
            .then(() => {
                done("User is return, but need except error");
            }, (err) => {
                try {
                    expect(err.type).to.equal("EmailExistsError");
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it("should send recover letter", (done) => {
        User.remember("58f0ea6724b417485def0acb", false)
            .then((hash: string) => {
                try {
                    expect(hash.length > 0).to.equal(true);
                    done();
                } catch (e) {
                    done(e);
                }
            }, (err) => {
                done(err);
            });
    });

    it("should activate user by hash", (done) => {
        User.activate("58f0ea6724b417485def0ac2", "hash")
            .then((user: IUser) => {
                try {
                    expect(user.status).to.equal(ACTIVE);
                    done();
                } catch (e) {
                    done(e);
                }
            }, (err) => {
                done(err);
            });
    });

    it("should except error 'Bad hash'", (done) => {
        User.activate("58f0ea6724b417485def0ac2", "hash2")
            .then(() => {
                done("User is return, but need except error");
            }, (err) => {
                try {
                    expect(err.type).to.equal("RecoverError");
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

});
