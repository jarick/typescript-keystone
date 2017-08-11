 import { expect } from "chai";
 import "mocha";
 import keystone from "../../../index";
 import load from "../email.fixture";
 import {IEmailTemplateModel} from "./template.model";

 describe("E_Mail template model", () => {
     beforeEach((done) => load(keystone.mongoose.connection, done));
     const Model: IEmailTemplateModel = keystone.list("EmailTemplate").model;

     it("should send email", (done) => {
         Model.get("registration")
             .then((template) => {
                 try {
                     expect(template.code).to.be.equal("registration");
                     done();
                 } catch (e) {
                     done(e);
                 }
             }, (err) => {
                done(err);
             });
     });

     it("should except template is not found", (done) => {
         Model.get("registration2")
             .then(() => {
                 done("Template is return, but need except error");
             }, (err) => {
                 try {
                     expect(err.type).to.be.equal("TemplateNotFoundError");
                     done();
                 } catch (e) {
                     done(e);
                 }
             });
     });

 });
