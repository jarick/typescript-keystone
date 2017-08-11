import "mocha";
import keystone from "../../../index";
import request = require("supertest");
import load from "../site.fixture";

describe("Layout routes", () => {
    beforeEach((done) => load(keystone.mongoose.connection, done));

    it("should return layout", (done) => {
        request(keystone.app)
            .get("/api/v1/site/layout")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, {
                icon: "#",
                name: "Main layout",
            }, done);
    });
});
