import { expect } from "chai";
import "mocha";
import keystone from "../../../index";
import request = require("supertest");
import load from "../account.fixture";

describe("Auth routes", () => {
    beforeEach((done) => load(keystone.mongoose.connection, done));

    it("should return new user after registration", (done) => {
        request(keystone.app)
            .post("/api/v1/account/auth/register")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .send({
                email: "admin21@email.no",
                password: "qwerty1234",
            })
            .expect(200)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }
                try {
                    expect(response.body).to.have.property("email", "admin21@email.no");
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it("should login user", (done) => {
        request(keystone.app)
            .post("/api/v1/account/auth/login")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .send({
                email: "admin@email.no",
                password: "qwerty",
            })
            .expect(200)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }
                expect(response.body).to.have.property("token");
                done();
            });
    });

    it("should return user by token", (done) => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6I" +
            "jU4ZjBlYTY3MjRiNDE3NDg1ZGVmMGFjYiIsImlhdCI6MTQ5MjMzNzkzNn0." +
            "Jzd5t3SiYEgzif4TyGUZEHxFKXSmU2BxO9lfyABXMD4";
        request(keystone.app)
            .get("/api/v1/account/auth/me")
            .set("Authorization", `Bearer ${token}`)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }
                try {
                    expect(response.body).to.have.property("email", "admin@email.no");
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

});
