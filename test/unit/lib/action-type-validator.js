require("unit-setup.js");

import {String, Number, tuple} from "tcomb";

import actionTypeValidator from "lib/action-type-validator";

describe("`actionTypeValidator` function", () => {

    it("should return a function", () => {
        const ret = actionTypeValidator();
        expect(ret).to.be.an.instanceOf(Function);
    });

    it("should throw an `Error` if the types of the args aren't the expected types", () => {
        const retFunction = actionTypeValidator(tuple([String, Number]));
        const argument = ["firstArgument", "seconddArgument"];
        function troublemaker () {
            retFunction(argument);
        }
        expect(troublemaker).to.throw();
    });

    it("shouldn't throw an `Error` if the types of the args are the expected types", () => {
        const retFunction = actionTypeValidator(tuple([String, Number]));
        const argument = ["firstArgument", 123];
        function troublemaker () {
            retFunction(argument);
        }
        expect(troublemaker).not.to.throw();
    });

});
