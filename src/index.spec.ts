import { expect } from "chai";
import "mocha";
import process = require("process");
import keystone from "./index";
import request = require("supertest");

describe("General tests", () => {
    it("should return hello world", () => {
        const hello = (): string => "Hello World!";
        const result = hello();
        expect(result).to.equal("Hello World!");
    });
    it("should be test envariment", () => {
        expect(process.env.NODE_ENV).to.eq("test");
        expect(process.env.JWT_SECRET).to.eq("jarick-secret-test");
        expect(process.env.MONGO_HOST).to.eq("mongodb://localhost/bitcoins-test");
    });
    it("should return 200 status when index page is call", (done) => {
        request(keystone.app)
            .get("/")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });
});
