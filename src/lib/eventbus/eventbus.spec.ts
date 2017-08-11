import { expect } from "chai";
import "mocha";
import EventBus from "./index";

describe("EventBus library", () => {

    it("should dispatch event", (done) => {
        EventBus.addEventListener("test:test", (event, code) => {
            expect(code).be.eq("test");
            done();
        });
        EventBus.dispatch("test:test", null, "test");
    });

});
