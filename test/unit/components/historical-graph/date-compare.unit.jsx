require("unit-setup.js");

var Immutable = require("immutable");
var moment    = require("moment");
var R         = require("ramda");

var DygraphCoordinate = require("lib/app-prop-types.js").DygraphCoordinate;

var DateCompareGraph = proxyquire("components/historical-graph/date-compare.jsx", {});

describe("The `getCoordinates` method of the DateCompare component", function () {

    var getCoordinates = DateCompareGraph.prototype.getCoordinates;

    var getRandomMonth = function () {
        return (Math.ceil(Math.random() * 100) % 12) + 1;
    };

    var getRandomPod = function () {
        return (Math.ceil(Math.random() * 100) % 3) + 1;
    };

    var getRandomTipologia = function () {
        return (Math.ceil(Math.random() * 100) % 3) + 1;
    };

    var getMisura = function (month, pod, tipologia) {
        /*
        *   Since pod and tipologia references are lost when the misura is
        *   converted to a DygraphCoordinate type, to retrieve the two values at
        *   assertion time we save them in the prop1 and prop2 properties, which
        *   are retrievable from the DygraphCoordinate structure.
        *   (A bit of a hack, but it works)
        */
        return {
            data: "2015-" + month + "-01",
            pod: pod,
            prop1: pod,
            prop2: tipologia,
            tipologia: tipologia
        };
    };

    var getMisure = function () {
        return R.range(0, 100).reduce(function (misure, index) {
            var month = getRandomMonth();
            var pod = getRandomPod();
            var tipologia = getRandomTipologia();
            return R.assoc(
                "m" + index,
                getMisura(month, pod, tipologia),
                misure
            );
        }, {});
    };

    var getInstance = function (pod, tipologia, period) {
        return {
            props: {
                dateCompare: {
                    period: period,
                    dateOne: "Wed Sep 02 2015 12:13:59 GMT+0200 (CEST)"
                },
                misure: Immutable.fromJS(getMisure()),
                siti: [Immutable.Map({
                    pod: pod
                })],
                tipologia: {
                    key: tipologia
                },
                valori: [
                    {key: "prop1"},
                    {key: "prop2"}
                ]
            }
        };
    };

    it("should return an array", function () {
        var instance = getInstance(1, 1, "months");
        var dc = instance.props.dateCompare.dateOne;
        instance.getDateRanges = function () {
            return {
                rangeOne: {
                    start: moment(dc).subtract(5, "weeks").valueOf(),
                    end: dc
                },
                rangeTwo: {
                    start: moment(dc).subtract(10, "weeks").valueOf(),
                    end: moment(dc).subtract(5, "weeks").valueOf()
                }
            };
        };
        var coordinates = getCoordinates.call(instance);
        expect(coordinates).to.be.an.instanceOf(Array);
    });

    it("should filter misure by pod", function () {
        var instance = getInstance(1, 1, "years");
        var dc = instance.props.dateCompare.dateOne;
        instance.getDateRanges = function () {
            return {
                rangeOne: {
                    start: moment(dc).subtract(5, "weeks").valueOf(),
                    end: dc
                },
                rangeTwo: {
                    start: moment(dc).subtract(57, "weeks").valueOf(),
                    end: moment(dc).subtract(53, "weeks").valueOf()
                }
            };
        };
        var coordinates = getCoordinates.call(instance);
        coordinates.forEach(function (coordinate) {
            var actualProp1Value = coordinate[1][0];
            var expectedProp1Value = 1;
            expect(actualProp1Value).to.equal(expectedProp1Value);
        });
    });

    it("should format misure to match the DygraphCoordinate prop type", function () {
        var instance = getInstance(3, 3, "days");
        var dc = instance.props.dateCompare.dateOne;
        instance.getDateRanges = function () {
            return {
                rangeOne: {
                    start: moment(dc).subtract(1, "days").valueOf(),
                    end: dc
                },
                rangeTwo: {
                    start: moment(dc).subtract(2, "days").valueOf(),
                    end: moment(dc).subtract(1, "days").valueOf()
                }
            };
        };
        getCoordinates.call(instance)
            .forEach(function (coordinate) {
                var ret = DygraphCoordinate({
                    prop: coordinate
                }, "prop");
                expect(ret).not.to.be.an.instanceOf(Error);
                expect(ret).to.equal(null);
            });
    });

    it("should filter misure by interval of data", function () {
        var data = "Wed Aug 1 2015 12:13:59 GMT+0200 (CEST)";
        var pod = "pod";
        var tipologia = 1;
        var instance = {
            props: {
                misure: Immutable.fromJS([
                    // in range 1
                    {
                        data: moment(data).subtract(1, "hours").valueOf(),
                        pod: pod,
                        prop1: pod,
                        prop2: tipologia,
                        tipologia: tipologia
                    },
                    // in range 2
                    {
                        data: moment(data).subtract(47, "hours").valueOf(),
                        pod: pod,
                        prop1: pod,
                        prop2: tipologia,
                        tipologia: tipologia
                    },
                    // non in range
                    {
                        data: moment(data).subtract(10, "days").valueOf(),
                        pod: pod,
                        prop1: pod,
                        prop2: tipologia,
                        tipologia: tipologia
                    }
                ]),
                siti: [Immutable.Map({
                    pod: pod
                })],
                tipologia: {
                    key: tipologia
                },
                valori: [
                    {key: "prop1"},
                    {key: "prop2"}
                ]
            }
        };
        instance.getDateRanges = function () {
            return {
                rangeOne: {
                    start: moment(data).subtract(1, "days").valueOf(),
                    end: moment(data)
                },
                rangeTwo: {
                    start: moment(data).subtract(2, "days").valueOf(),
                    end: moment(data).subtract(1, "days").valueOf()
                }
            };
        };
        var coordinates = getCoordinates.call(instance);
        expect(2).to.be.equal(coordinates.length);

    });

    it("should sort misure by data", function () {
        var data = "Wed Aug 1 2015 12:13:59 GMT+0200 (CEST)";
        var pod = "pod";
        var tipologia = 1;
        var instance = {
            props: {
                dateCompare: {
                    period: "months",
                    dateOne: "Wed Sep 02 2015 12:13:59 GMT+0200 (CEST)"
                },
                misure: Immutable.fromJS([
                    // in range 1
                    {
                        data: moment(data).subtract(1, "hours").valueOf(),
                        pod: pod,
                        prop1: pod,
                        prop2: tipologia,
                        tipologia: tipologia
                    },
                    // in range 2
                    {
                        data: moment(data).subtract(47, "hours").valueOf(),
                        pod: pod,
                        prop1: pod,
                        prop2: tipologia,
                        tipologia: tipologia
                    },
                    // non in range
                    {
                        data: moment(data).subtract(10, "days").valueOf(),
                        pod: pod,
                        prop1: pod,
                        prop2: tipologia,
                        tipologia: tipologia
                    }
                ]),
                siti: [Immutable.Map({
                    pod: pod
                })],
                tipologia: {
                    key: tipologia
                },
                valori: [
                    {key: "prop1"},
                    {key: "prop2"}
                ]
            }
        };
        var dc = instance.props.dateCompare.dateOne;
        instance.getDateRanges = function () {
            return {
                rangeOne: {
                    start: moment(dc).subtract(5, "weeks").valueOf(),
                    end: dc
                },
                rangeTwo: {
                    start: moment(dc).subtract(10, "weeks").valueOf(),
                    end: moment(dc).subtract(5, "weeks").valueOf()
                }
            };
        };
        getCoordinates.call(instance)
            .map(R.prop("0"))
            .reduce(function (pre, cur) {
                expect(pre <= cur).to.equal(true);
                return cur;
            });
    });

});
