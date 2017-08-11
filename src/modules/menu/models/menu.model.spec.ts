import { expect } from "chai";
import "mocha";
import keystone from "../../../index";
import load from "../menu.fixture";
import {IMenuModel} from "./menu.model";

describe("User model", () => {
    beforeEach((done) => load(keystone.mongoose.connection, done));
    const Menu: IMenuModel = keystone.list("Menu").model;

    it("should return menu by slug", (done) => {
        Menu.getBySlug("test-menu")
            .then((menu) => {
                try {
                    expect(menu).to.deep.equal({
                        items: [
                            {
                                href: "/example-1",
                                items: [
                                    {
                                        href: "/example-2",
                                        items: [
                                            {
                                                href: "/example-3",
                                                items: [],
                                                title: "Item 3",
                                            },
                                        ],
                                        title: "Item 2",
                                    },
                                ],
                                title: "Item 1",
                            },
                        ],
                        name: "Test menu",
                        slug: "test-menu",
                    });
                    done();
                } catch (e) {
                    done(e);
                }
            })
            .catch((err) => {
                done(err);
            });
    });

    it("should return except 'Menu is not find'", (done) => {
        Menu.getBySlug("test-menu-2")
            .then(() => {
                done("Menu is return, but need except error");
            })
            .catch((err) => {
                try {
                    expect(err.type).to.equal("MenuNotFound");
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

});
