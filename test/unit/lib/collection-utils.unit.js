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

        it("should return the correct array with single variable", function () {
            var measures = Immutable.Map({
                month: monthString,
                readings: Immutable.Map({
                    lux: "1,2,3,4,,6,7.8",
                    potenza: "11,22,33,44,55,,,8.9"
                })
            });
            var variable = ["lux"];
            var expected = [
                [new Date(toDateTime(0)), [parseFloat(1), 0]],
                [new Date(toDateTime(1)), [parseFloat(2), 0]],
                [new Date(toDateTime(2)), [parseFloat(3), 0]],
                [new Date(toDateTime(3)), [parseFloat(4), 0]],
                [new Date(toDateTime(4)), [parseFloat(null), 0]],
                [new Date(toDateTime(5)), [parseFloat(6), 0]],
                [new Date(toDateTime(6)), [parseFloat(7.8), 0]]
            ];
            var result = CollectionUtils.measures.convertByVariables(measures, variable);
            expect(expected).to.deep.equal(result);
        });

        it("should return an array with two variables", function () {
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
                [new Date(toDateTime(0)), [parseFloat(1), 0], [parseFloat(111), 0]],
                [new Date(toDateTime(1)), [parseFloat(2), 0], [parseFloat(222), 0]],
                [new Date(toDateTime(2)), [parseFloat(3), 0], [parseFloat(333), 0]],
                [new Date(toDateTime(3)), [parseFloat(4), 0], [parseFloat(444), 0]],
                [new Date(toDateTime(4)), [parseFloat(null), 0], [parseFloat(555), 0]],
                [new Date(toDateTime(5)), [parseFloat(6), 0], [parseFloat(null), 0]],
                [new Date(toDateTime(6)), [parseFloat(7.8), 0], [parseFloat(7.77), 0]]
            ];
            var result = CollectionUtils.measures.convertByVariables(measures, variables);
            expect(expected).to.deep.equal(result);
        });

        it("should return the correct array even if a requested variable is missing", function () {
            var measures = Immutable.Map({
                month: monthString,
                readings: Immutable.Map({
                    lux: "1,2,3,4,,6,7.8",
                    potenza: "11,22,33,44,55,,,8.9"
                })
            });
            var variables = ["lux", "other"];
            var expected = [
                [new Date(toDateTime(0)), [parseFloat(1), 0], [parseFloat(null), 0]],
                [new Date(toDateTime(1)), [parseFloat(2), 0], [parseFloat(null), 0]],
                [new Date(toDateTime(2)), [parseFloat(3), 0], [parseFloat(null), 0]],
                [new Date(toDateTime(3)), [parseFloat(4), 0], [parseFloat(null), 0]],
                [new Date(toDateTime(4)), [parseFloat(null), 0], [parseFloat(null), 0]],
                [new Date(toDateTime(5)), [parseFloat(6), 0], [parseFloat(null), 0]],
                [new Date(toDateTime(6)), [parseFloat(7.8), 0], [parseFloat(null), 0]]
            ];
            var result = CollectionUtils.measures.convertByVariables(measures, variables);
            expect(expected).to.deep.equal(result);
        });
    });

    describe("the `convertBySitesAndVariable` function", function () {

        it("should return the correct array filter by variable", function () {
            var measures = Immutable.Map({
                id1: Immutable.Map({
                    month: monthString,
                    podId: "pod1",
                    readings: Immutable.Map({
                        lux: "1,2,3,4,,6,7.8,",
                        potenza: "11,22,33,44,55,,,8.9"
                    })
                }),
                id2: Immutable.Map({
                    month: monthString,
                    podId: "pod2",
                    readings: Immutable.Map({
                        lux: "11,22,33,44,55,,,8.9",
                        co2: "1,2,3,4,,6,7.8"
                    })
                })
            });

            var expected = [
                [new Date(toDateTime(0)), [parseFloat(11), 0], [parseFloat(1), 0]],
                [new Date(toDateTime(1)), [parseFloat(22), 0], [parseFloat(2), 0]],
                [new Date(toDateTime(2)), [parseFloat(33), 0], [parseFloat(3), 0]],
                [new Date(toDateTime(3)), [parseFloat(44), 0], [parseFloat(4), 0]],
                [new Date(toDateTime(4)), [parseFloat(55), 0], [parseFloat(null), 0]],
                [new Date(toDateTime(5)), [parseFloat(null), 0], [parseFloat(6), 0]],
                [new Date(toDateTime(6)), [parseFloat(null), 0], [parseFloat(7.8), 0]],
                [new Date(toDateTime(7)), [parseFloat(8.9), 0], [parseFloat(null), 0]]
            ];

            var result = CollectionUtils.measures.convertBySitesAndVariable(measures, ["pod2", "pod1"], "lux");
            expect(expected).to.deep.equal(result);
        });

        it("should return the correct array if only the same site is given", function () {
            var measures = Immutable.Map({
                id1: Immutable.Map({
                    month: monthString,
                    podId: "pod1",
                    readings: Immutable.Map({
                        lux: "1,2,3,4,,6,7.8,",
                        potenza: "11,22,33,44,55,,,8.9"
                    })
                })
            });

            var expected = [
                [new Date(toDateTime(0)), [parseFloat(1), 0], [parseFloat(1), 0]],
                [new Date(toDateTime(1)), [parseFloat(2), 0], [parseFloat(2), 0]],
                [new Date(toDateTime(2)), [parseFloat(3), 0], [parseFloat(3), 0]],
                [new Date(toDateTime(3)), [parseFloat(4), 0], [parseFloat(4), 0]],
                [new Date(toDateTime(4)), [parseFloat(null), 0], [parseFloat(null), 0]],
                [new Date(toDateTime(5)), [parseFloat(6), 0], [parseFloat(6), 0]],
                [new Date(toDateTime(6)), [parseFloat(7.8), 0], [parseFloat(7.8), 0]],
                [new Date(toDateTime(7)), [parseFloat(null), 0], [parseFloat(null), 0]]
            ];

            var result = CollectionUtils.measures.convertBySitesAndVariable(measures, ["pod1", "pod1"], "lux");
            expect(expected).to.deep.equal(result);
        });
    });

    describe("the `convertByDatesAndVariable` function", function () {

        it("should return the correct array filter by variable", function () {
            var month1 = "2015-10";
            var month2 = "2015-11";
            var measures = Immutable.Map({
                id1: Immutable.Map({
                    month: month1,
                    podId: "pod1",
                    readings: Immutable.Map({
                        lux: "1,2,3,4,,6,7.8,",
                        potenza: "11,22,33,44,55,,,8.9"
                    })
                }),
                id2: Immutable.Map({
                    month: month2,
                    podId: "pod1",
                    readings: Immutable.Map({
                        lux: "11,22,33,44,55,,,8.9",
                        co2: "1,2,3,4,,6,7.8"
                    })
                })
            });

            var dateMonthTime = function (pos) {
                return new Date(0).getTime() + (pos * fiveMinutesInMS);
            };

            var expected = [
                [new Date(dateMonthTime(0)), [parseFloat(11), 0], [parseFloat(1), 0]],
                [new Date(dateMonthTime(1)), [parseFloat(22), 0], [parseFloat(2), 0]],
                [new Date(dateMonthTime(2)), [parseFloat(33), 0], [parseFloat(3), 0]],
                [new Date(dateMonthTime(3)), [parseFloat(44), 0], [parseFloat(4), 0]],
                [new Date(dateMonthTime(4)), [parseFloat(55), 0], [parseFloat(null), 0]],
                [new Date(dateMonthTime(5)), [parseFloat(null), 0], [parseFloat(6), 0]],
                [new Date(dateMonthTime(6)), [parseFloat(null), 0], [parseFloat(7.8), 0]],
                [new Date(dateMonthTime(7)), [parseFloat(8.9), 0], [parseFloat(null), 0]]
            ];
            var result = CollectionUtils.measures.convertByDatesAndVariable(measures, "pod1", "lux", [month2, month1]);
            expect(expected).to.deep.equal(result);
        });

    });

    describe("the `mergeCoordinates` function", function () {

        it("should return the correct array if 2 arrays are given", function () {
            var coordinate1 = [
                [new Date(toDateTime(0)), [parseFloat(1), 0]],
                [new Date(toDateTime(1)), [parseFloat(2), 0]],
                [new Date(toDateTime(2)), [parseFloat(3), 0]],
                [new Date(toDateTime(3)), [parseFloat(4), 0]],
                [new Date(toDateTime(4)), [parseFloat(null), 0]],
                [new Date(toDateTime(5)), [parseFloat(6), 0]],
                [new Date(toDateTime(6)), [parseFloat(7.8), 0]],
                [new Date(toDateTime(7)), [parseFloat(null), 0]]
            ];
            var coordinate2 = [
                [new Date(toDateTime(0)), [parseFloat(11), 0]],
                [new Date(toDateTime(1)), [parseFloat(22), 0]],
                [new Date(toDateTime(2)), [parseFloat(33), 0]],
                [new Date(toDateTime(3)), [parseFloat(44), 0]],
                [new Date(toDateTime(4)), [parseFloat(55), 0]],
                [new Date(toDateTime(5)), [parseFloat(null), 0]],
                [new Date(toDateTime(6)), [parseFloat(null), 0]],
                [new Date(toDateTime(7)), [parseFloat(8.9), 0]]
            ];
            var expected = [
                [new Date(toDateTime(0)), [parseFloat(1), 0], [parseFloat(11), 0]],
                [new Date(toDateTime(1)), [parseFloat(2), 0], [parseFloat(22), 0]],
                [new Date(toDateTime(2)), [parseFloat(3), 0], [parseFloat(33), 0]],
                [new Date(toDateTime(3)), [parseFloat(4), 0], [parseFloat(44), 0]],
                [new Date(toDateTime(4)), [parseFloat(null), 0], [parseFloat(55), 0]],
                [new Date(toDateTime(5)), [parseFloat(6), 0], [parseFloat(null), 0]],
                [new Date(toDateTime(6)), [parseFloat(7.8), 0], [parseFloat(null), 0]],
                [new Date(toDateTime(7)), [parseFloat(null), 0], [parseFloat(8.9), 0]]
            ];

            var result = CollectionUtils.measures.mergeCoordinates(coordinate1, coordinate2);
            expect(expected).to.deep.equal(result);
        });

        it("should fill the empty fields with NaN", function () {
            var coordinate1 = [
                [new Date(toDateTime(0)), [parseFloat(1), 0]],
                [new Date(toDateTime(1)), [parseFloat(2), 0]],
                [new Date(toDateTime(2)), [parseFloat(3), 0]],
                [new Date(toDateTime(3)), [parseFloat(4), 0]],
                [new Date(toDateTime(4)), [parseFloat(5), 0]]
            ];
            var coordinate2 = [
                [new Date(toDateTime(0)), [parseFloat(11), 0]],
                [new Date(toDateTime(1)), [parseFloat(22), 0]],
                [new Date(toDateTime(2)), [parseFloat(33), 0]],
                [new Date(toDateTime(3)), [parseFloat(44), 0]],
                [new Date(toDateTime(4)), [parseFloat(55), 0]],
                [new Date(toDateTime(5)), [parseFloat(6), 0]],
                [new Date(toDateTime(6)), [parseFloat(7.8), 0]],
                [new Date(toDateTime(7)), [parseFloat(null), 0]]
            ];
            var expected = [
                [new Date(toDateTime(0)), [parseFloat(1), 0], [parseFloat(11), 0]],
                [new Date(toDateTime(1)), [parseFloat(2), 0], [parseFloat(22), 0]],
                [new Date(toDateTime(2)), [parseFloat(3), 0], [parseFloat(33), 0]],
                [new Date(toDateTime(3)), [parseFloat(4), 0], [parseFloat(44), 0]],
                [new Date(toDateTime(4)), [parseFloat(5), 0], [parseFloat(55), 0]],
                [new Date(toDateTime(5)), [parseFloat(null), 0], [parseFloat(6), 0]],
                [new Date(toDateTime(6)), [parseFloat(null), 0], [parseFloat(7.8), 0]],
                [new Date(toDateTime(7)), [parseFloat(null), 0], [parseFloat(null), 0]]
            ];

            var result = CollectionUtils.measures.mergeCoordinates(coordinate1, coordinate2);
            expect(expected).to.deep.equal(result);
        });
    });
});
