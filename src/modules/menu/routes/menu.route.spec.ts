import "mocha";
import keystone from "../../../index";
import request = require("supertest");
import load from "../menu.fixture";

describe("Menu routes", () => {
    beforeEach((done) => load(keystone.mongoose.connection, done));

    it("should return menu by code", (done) => {
        request(keystone.app)
            .get("/api/v1/menu/menu/test-menu")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, {
                items: [{
                    href: "/example-1",
                    items: [{
                        href: "/example-2",
                        items: [{
                            href: "/example-3",
                            items: [],
                            title: "Item 3",
                        }],
                        title: "Item 2",
                    }],
                    title: "Item 1",
                }],
                name: "Test menu",
                slug: "test-menu",
            }, done);
    });
});
