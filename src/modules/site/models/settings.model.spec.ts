import { expect } from "chai";
import "mocha";
import keystone from "../../../index";
import load from "../site.fixture";
import {IPageModel, IPageSerialize} from "./home.model";

describe("Settings page", () => {
    beforeEach((done) => load(keystone.mongoose.connection, done));

    it("should return settings page", (done) => {
        const Model: IPageModel = keystone.list("SettingsPage").model;
        Model.getSingle()
            .then((page: IPageSerialize) => {
                try {
                    expect(page).to.deep.equal({
                        content: "<div>test</div>",
                        meta: [
                            {name: "description", value: "test"},
                            {name: "description2", value: "test2"},
                        ],
                        title: "Settings page",
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
