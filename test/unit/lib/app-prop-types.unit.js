require("unit-setup.js");

var AppPropTypes = proxyquire("lib/app-prop-types.js", {});

describe("The `DateEquivalent` function", function () {

    // it("should return an error if the prop is not a date representation", function () {
    //     var props = {
    //         x: "definitelyNotAdate",
    //         y: 1
    //     };
    //     var resultApply = AppPropTypes.DateEquivalent(props, "x");
    //     expect(resultApply).to.be.an.instanceOf(Error);
    //     expect(resultApply.message).to.equal("x must represent a date");
    // });
    //
    // it("should not return an error if the prop is a date representation", function () {
    //     var props = {
    //         x: "2015-01-01",
    //         y: 1
    //     };
    //     var resultApply = AppPropTypes.DateEquivalent(props, "x");
    //     expect(resultApply).not.to.be.an.instanceOf(Error);
    // });

});
