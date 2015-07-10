require("unit-setup.js");

var AppPropTypes = proxyquire("lib/app-prop-types.js", {});

describe("The DygraphCoordinate method", function () {

    it("should not return an error if the prop is a DygraphCoordinate format", function () {
        var case1 = [new Date(), [2, 2]];
        var case2 = [new Date(), [1, 2], [3, 4]];
        var props = {coordinates: case1};
        expect(AppPropTypes.DygraphCoordinate(props, "coordinates")).to.be.null;
        props = {coordinates: case2};
        expect(AppPropTypes.DygraphCoordinate(props, "coordinates")).to.be.null;
    });

    it("should return an error if the first element of the coordinates is not a Date", function () {
        var case1 = ["2015-01-01", [1, 2]];
        var props = {coordinates: case1};

        var validationResult = AppPropTypes.DygraphCoordinate(props, "coordinates");
        expect(validationResult).to.be.an.instanceOf(Error);
        expect(validationResult.message).to.contains("must be a date");
    });

    it("should return an error if the other elements are not arrays", function () {
        var case1 = [new Date(), 1, 2];
        var props = {coordinates: case1};

        var validationResult = AppPropTypes.DygraphCoordinate(props, "coordinates");
        expect(validationResult).to.be.an.instanceOf(Error);
        expect(validationResult.message).to.contains("must be a 2-tuple of numbers");
    });

    it("should return an error if the array don't contains numbers only", function () {

        var case1 = [new Date(), [1, "2"]];
        var props = {coordinates: case1};

        var validationResult = AppPropTypes.DygraphCoordinate(props, "coordinates");
        expect(validationResult).to.be.an.instanceOf(Error);
        expect(validationResult.message).to.contains("must be a 2-tuple of numbers");
    });

    it("should return an error if the array contains more than two values", function () {

        var case1 = [new Date(), [1, 2, 3]];
        var props = {coordinates: case1};

        var validationResult = AppPropTypes.DygraphCoordinate(props, "coordinates");
        expect(validationResult).to.be.an.instanceOf(Error);
        expect(validationResult.message).to.contains("must be a 2-tuple of numbers");
    });
});
