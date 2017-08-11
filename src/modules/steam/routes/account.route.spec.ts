import { expect } from "chai";
import "mocha";
import keystone from "../../../index";
import request = require("supertest");
import load from "../steam.fixture";

describe("Steam account routes", () => {
    beforeEach((done) => load(keystone.mongoose.connection, done));

    it("should return user by token", (done) => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6I" +
            "jU4ZjBlYTY3MjRiNDE3NDg1ZGVmMGFjYiIsImlhdCI6MTQ5MjMzNzkzNn0." +
            "Jzd5t3SiYEgzif4TyGUZEHxFKXSmU2BxO9lfyABXMD4";
        request(keystone.app)
            .get("/api/v1/steam/account/auth")
            .set("Authorization", `Bearer ${token}`)
            .set("Accept", "application/json")
            .expect(302)
            .end((err) => {
                done(err);
            });
    });

    it("should return steam ids by user id", (done) => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6I" +
            "jU4ZjBlYTY3MjRiNDE3NDg1ZGVmMGFjYiIsImlhdCI6MTQ5MjMzNzkzNn0." +
            "Jzd5t3SiYEgzif4TyGUZEHxFKXSmU2BxO9lfyABXMD4";
        request(keystone.app)
            .get("/api/v1/steam/account/5833ea6724b417485def0ac1")
            .set("Authorization", `Bearer ${token}`)
            .set("Accept", "application/json")
            .expect(200, ["76561198180806406"], done);
    });

    it("should return inventory by user id and steam id", (done) => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6I" +
            "jU4ZjBlYTY3MjRiNDE3NDg1ZGVmMGFjYiIsImlhdCI6MTQ5MjMzNzkzNn0." +
            "Jzd5t3SiYEgzif4TyGUZEHxFKXSmU2BxO9lfyABXMD4";
        request(keystone.app)
            .get("/api/v1/steam/account/5833ea6724b417485def0ac1/76561198180806406")
            .set("Authorization", `Bearer ${token}`)
            .set("Accept", "application/json")
            .expect(200)
            .end((err: any, response: any) => {
                if (err) {
                    done(err);
                } else {
                    try {
                        expect(response.body.success).to.equal(1);
                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            });
    });

});
