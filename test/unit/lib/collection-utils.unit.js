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

        it("should return the correct filtered array with single variable", function () {
            var measures = Immutable.Map({
                month: monthString,
                readings: Immutable.Map({
                    lux: "1,1.09,3,3.2,,6,6.1",
                    potenza: "11,22,33,44,55,,,8.9"
                })
            });
            var variable = ["lux"];
            var expected = [
                [new Date(toDateTime(0)), [parseFloat(1)]],
                [new Date(toDateTime(2)), [parseFloat(3)]],
                [new Date(toDateTime(5)), [parseFloat(6)]],
                [new Date(toDateTime(6)), [parseFloat(6.1)]]
            ];
            var result = CollectionUtils.measures.convertByVariables(measures, variable);
            expect(expected).to.deep.equal(result);
        });

        it("should return the filtered array with two variables", function () {
            var measures = Immutable.Map({
                month: monthString,
                readings: Immutable.Map({
                    lux: "1,2,3,4,,6,7.8",
                    co2: "11,22,33,44,55,,",
                    potenza: "111,222,333,444,555,,7.77"
                })
            });
            var variables = ["lux", "potenza"];
            var expected = [
                [new Date(toDateTime(0)), [parseFloat(1)], [parseFloat(111)]],
                [new Date(toDateTime(1)), [parseFloat(2)], [parseFloat(222)]],
                [new Date(toDateTime(2)), [parseFloat(3)], [parseFloat(333)]],
                [new Date(toDateTime(3)), [parseFloat(4)], [parseFloat(444)]],
                [new Date(toDateTime(4)), [parseFloat(4)], [parseFloat(555)]],
                [new Date(toDateTime(5)), [parseFloat(6)], [parseFloat(555)]],
                [new Date(toDateTime(6)), [parseFloat(7.8)], [parseFloat(7.77)]]
            ];
            var result = CollectionUtils.measures.convertByVariables(measures, variables);
            expect(expected).to.deep.equal(result);
        });

        // it("should return the correct array even if a requested variable is missing", function () {
        //     var measures = Immutable.Map({
        //         month: monthString,
        //         readings: Immutable.Map({
        //             lux: "1,22,3,44,,36,7.8",
        //             potenza: "11,22,33,44,55,,,8.9"
        //         })
        //     });
        //     var variables = ["lux", "other"];
        //     var expected = [
        //         [new Date(toDateTime(0)), [parseFloat(1)], [null]],
        //         [new Date(toDateTime(1)), [parseFloat(22)], [null]],
        //         [new Date(toDateTime(2)), [parseFloat(3)], [null]],
        //         [new Date(toDateTime(3)), [parseFloat(44)], [null]],
        //         [new Date(toDateTime(4)), [parseFloat(44)], [null]],
        //         [new Date(toDateTime(5)), [parseFloat(36)], [null]],
        //         [new Date(toDateTime(6)), [parseFloat(7.8)], [null]]
        //     ];
        //     var result = CollectionUtils.measures.convertByVariables(measures, variables);
        //     expect(expected).to.deep.equal(result);
        // });
    });

    describe.skip("the `convertBySitesAndVariable` function", function () {

        it.skip("should return the correct array filter by variable", function () {
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
                [new Date(toDateTime(0)), [parseFloat(11)], [parseFloat(1)]],
                [new Date(toDateTime(1)), [parseFloat(22)], [parseFloat(2)]],
                [new Date(toDateTime(2)), [parseFloat(33)], [parseFloat(3)]],
                [new Date(toDateTime(3)), [parseFloat(44)], [parseFloat(4)]],
                [new Date(toDateTime(5)), [parseFloat(55)], [parseFloat(6)]],
                [new Date(toDateTime(6)), [parseFloat(8.9)], [parseFloat(7.8)]],
                [new Date(toDateTime(7)), [parseFloat(NaN)], [parseFloat(7.8)]]
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
                [new Date(toDateTime(0)), [parseFloat(1)], [parseFloat(1)]],
                [new Date(toDateTime(1)), [parseFloat(2)], [parseFloat(2)]],
                [new Date(toDateTime(2)), [parseFloat(3)], [parseFloat(3)]],
                [new Date(toDateTime(3)), [parseFloat(4)], [parseFloat(4)]],
                [new Date(toDateTime(5)), [parseFloat(6)], [parseFloat(6)]],
                [new Date(toDateTime(6)), [parseFloat(7.8)], [parseFloat(7.8)]],
                [new Date(toDateTime(7)), [parseFloat(7.8)], [parseFloat(7.8)]]
            ];
            var result = CollectionUtils.measures.convertBySitesAndVariable(measures, ["pod1", "pod1"], "lux");
            expect(expected).to.deep.equal(result);
        });
    });

    describe.skip("the `convertByDatesAndVariable` function", function () {

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
                [new Date(dateMonthTime(0)), [parseFloat(11)], [parseFloat(1)]],
                [new Date(dateMonthTime(1)), [parseFloat(22)], [parseFloat(2)]],
                [new Date(dateMonthTime(2)), [parseFloat(33)], [parseFloat(3)]],
                [new Date(dateMonthTime(3)), [parseFloat(44)], [parseFloat(4)]],
                [new Date(dateMonthTime(4)), [parseFloat(55)], [parseFloat(4)]],
                [new Date(dateMonthTime(5)), [parseFloat(55)], [parseFloat(6)]],
                [new Date(dateMonthTime(6)), [parseFloat(55)], [parseFloat(7.8)]],
                [new Date(dateMonthTime(7)), [parseFloat(8.9)], [parseFloat(7.8)]]
            ];
            var result = CollectionUtils.measures.convertByDatesAndVariable(measures, "pod1", "lux", [month2, month1]);
            expect(expected).to.deep.equal(result);
        });

    });

    describe("the `mergeCoordinates` function", function () {

        it("should return the correct array if 2 arrays are given", function () {
            var coordinate1 = [
                [new Date(toDateTime(0)), [parseFloat(1)]],
                [new Date(toDateTime(1)), [parseFloat(2)]],
                [new Date(toDateTime(2)), [parseFloat(3)]],
                [new Date(toDateTime(3)), [parseFloat(4)]],
                [new Date(toDateTime(4)), [parseFloat(null)]],
                [new Date(toDateTime(5)), [parseFloat(6)]],
                [new Date(toDateTime(6)), [parseFloat(7.8)]],
                [new Date(toDateTime(7)), [parseFloat(null)]]
            ];
            var coordinate2 = [
                [new Date(toDateTime(0)), [parseFloat(11)]],
                [new Date(toDateTime(1)), [parseFloat(22)]],
                [new Date(toDateTime(2)), [parseFloat(33)]],
                [new Date(toDateTime(3)), [parseFloat(44)]],
                [new Date(toDateTime(4)), [parseFloat(55)]],
                [new Date(toDateTime(5)), [parseFloat(null)]],
                [new Date(toDateTime(6)), [parseFloat(null)]],
                [new Date(toDateTime(7)), [parseFloat(8.9)]]
            ];
            var expected = [
                [new Date(toDateTime(0)), [parseFloat(1)], [parseFloat(11)]],
                [new Date(toDateTime(1)), [parseFloat(2)], [parseFloat(22)]],
                [new Date(toDateTime(2)), [parseFloat(3)], [parseFloat(33)]],
                [new Date(toDateTime(3)), [parseFloat(4)], [parseFloat(44)]],
                [new Date(toDateTime(4)), [parseFloat(null)], [parseFloat(55)]],
                [new Date(toDateTime(5)), [parseFloat(6)], [parseFloat(null)]],
                [new Date(toDateTime(6)), [parseFloat(7.8)], [parseFloat(null)]],
                [new Date(toDateTime(7)), [parseFloat(null)], [parseFloat(8.9)]]
            ];
            var result = CollectionUtils.measures.mergeCoordinates(coordinate1, coordinate2);
            expect(expected).to.deep.equal(result);
        });

        it("should fill the empty fields with NaN", function () {
            var coordinate1 = [
                [new Date(toDateTime(0)), [parseFloat(1)]],
                [new Date(toDateTime(1)), [parseFloat(2)]],
                [new Date(toDateTime(2)), [parseFloat(3)]],
                [new Date(toDateTime(3)), [parseFloat(4)]],
                [new Date(toDateTime(4)), [parseFloat(5)]]
            ];
            var coordinate2 = [
                [new Date(toDateTime(0)), [parseFloat(11)]],
                [new Date(toDateTime(1)), [parseFloat(22)]],
                [new Date(toDateTime(2)), [parseFloat(33)]],
                [new Date(toDateTime(3)), [parseFloat(44)]],
                [new Date(toDateTime(4)), [parseFloat(55)]],
                [new Date(toDateTime(5)), [parseFloat(6)]],
                [new Date(toDateTime(6)), [parseFloat(7.8)]],
                [new Date(toDateTime(7)), [parseFloat(null)]]
            ];
            var expected = [
                [new Date(toDateTime(0)), [parseFloat(1)], [parseFloat(11)]],
                [new Date(toDateTime(1)), [parseFloat(2)], [parseFloat(22)]],
                [new Date(toDateTime(2)), [parseFloat(3)], [parseFloat(33)]],
                [new Date(toDateTime(3)), [parseFloat(4)], [parseFloat(44)]],
                [new Date(toDateTime(4)), [parseFloat(5)], [parseFloat(55)]],
                [new Date(toDateTime(5)), [parseFloat(null)], [parseFloat(6)]],
                [new Date(toDateTime(6)), [parseFloat(null)], [parseFloat(7.8)]],
                [new Date(toDateTime(7)), [parseFloat(null)], [parseFloat(null)]]
            ];

            var result = CollectionUtils.measures.mergeCoordinates(coordinate1, coordinate2);
            expect(expected).to.deep.equal(result);
        });
    });
});
