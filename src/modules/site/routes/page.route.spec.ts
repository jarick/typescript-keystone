import "mocha";
import keystone from "../../../index";
import request = require("supertest");
import load from "../site.fixture";

describe("Pages routes", () => {
    beforeEach((done) => load(keystone.mongoose.connection, done));

    it("should return home page", (done) => {
        request(keystone.app)
            .get("/api/v1/site/pages/home")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, {
                content: "<div>test</div>",
                meta: [
                    {name: "description", value: "test"},
                    {name: "description2", value: "test2"},
                ],
                title: "Home page",
            }, done);
    });
});
