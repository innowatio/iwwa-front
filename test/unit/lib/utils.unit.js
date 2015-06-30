require("unit-setup.js");

var utils = proxyquire("lib/utils.js", {});

describe("The `isDateEquivalent` function", function () {

    it("should return an error if the `x` prop is not a date representation", function () {
        var props = {
            x: "definitelyNotAdate",
            y: 1
        };
        var resultApply = utils.isDateEquivalent(props, "x");
        expect(resultApply).to.be.an.instanceOf(Error);
        expect(resultApply.message).to.equal("x must represent a date");
    });

    it("should not return an error if the `x` prop is a date representation", function () {
        var props = {
            x: "2015-01-01",
            y: 1
        };
        var resultApply = utils.isDateEquivalent(props, "x");
        expect(resultApply).not.to.be.an.instanceOf(Error);
    });
});
