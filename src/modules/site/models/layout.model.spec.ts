import { expect } from "chai";
import "mocha";
import keystone from "../../../index";
import load from "../site.fixture";
import {ILayout, ILayoutModel} from "./layout.model";

describe("Layout model", () => {
    beforeEach((done) => load(keystone.mongoose.connection, done));

    it("should return layout", (done) => {
        const Model: ILayoutModel = keystone.list("SiteLayout").model;
        Model.getSingle()
            .then((layout: ILayout) => {
                try {
                    expect(layout).to.deep.equal({
                        icon: "#",
                        name: "Main layout",
                    });
                    done();
                } catch (e) {
                    done(e);
                }
            }, (err) => {
                done(err);
            });
    });

});
