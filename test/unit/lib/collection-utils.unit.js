require("unit-setup.js");

var Immutable = require("immutable");

var CollectionUtils = proxyquire("lib/collection-utils.js", {});

describe("The `measures` method", function () {

    const fiveMinutesInMS = 5 * 60 * 1000;
    const monthString = "2015-10";

    var toDateTime = function (pos) {
        return new Date(monthString).getTime() + (pos * fiveMinutesInMS);
    };

    describe("the `convertByVariables` function", function () {

        it("should return the correct array", function () {
            var measures = Immutable.Map({
                month: monthString,
                readings: Immutable.Map({
                    lux: "1,2,3,4,,6,7.8",
                    potenza: "11,22,33,44,55,,,8.9"
                })
            });
            var variable = "lux";
            var expected = [
                [toDateTime(0), parseFloat(1)],
                [toDateTime(1), parseFloat(2)],
                [toDateTime(2), parseFloat(3)],
                [toDateTime(3), parseFloat(4)],
                [toDateTime(4), parseFloat(null)],
                [toDateTime(5), parseFloat(6)],
                [toDateTime(6), parseFloat(7.8)]
            ];
            var result = CollectionUtils.measures.convertByVariables(measures, [variable]);
            expect(expected).to.deep.equal(result);
        });

        it("should return an array", function () {
            var measures = Immutable.Map({
                month: monthString,
                readings: Immutable.Map({
                    lux: "1,2,3,4,,6,7.8",
                    co2: "11,22,33,44,55,,,8.9",
                    potenza: "111,222,333,444,555,,7.77"
                })
            });
            var variables = ["lux", "potenza"];
            var expected = [
                [toDateTime(0), parseFloat(1), parseFloat(111)],
                [toDateTime(1), parseFloat(2), parseFloat(222)],
                [toDateTime(2), parseFloat(3), parseFloat(333)],
                [toDateTime(3), parseFloat(4), parseFloat(444)],
                [toDateTime(4), parseFloat(null), parseFloat(555)],
                [toDateTime(5), parseFloat(6), parseFloat(null)],
                [toDateTime(6), parseFloat(7.8), parseFloat(7.77)]
            ];
            var result = CollectionUtils.measures.convertByVariables(measures, variables);
            expect(expected).to.deep.equal(result);
        });
    });
});
