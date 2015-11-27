require("unit-setup.js");

var Immutable = require("immutable");
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
        var instance = R.merge(
            getInstance(1, 1, "months"),
            {getDateFormatter: () => ["2015-01", "2015-02"]});
        var coordinates = getCoordinates.call(instance);
        expect(coordinates).to.be.an.instanceOf(Array);
    });

    it("should filter misure by pod", function () {
        var instance = R.merge(
            getInstance(1, 1, "years"),
            {getDateFormatter: () => ["2015-01", "2015-02"]});
        var coordinates = getCoordinates.call(instance);
        coordinates.forEach(function (coordinate) {
            var actualProp1Value = coordinate[1][0];
            var expectedProp1Value = 1;
            expect(actualProp1Value).to.equal(expectedProp1Value);
        });
    });

    it("should format misure to match the DygraphCoordinate prop type", function () {
        var instance = R.merge(
            getInstance(1, 1, "months"),
            {getDateFormatter: () => ["2015-01", "2015-02"]});
        getCoordinates.call(instance)
            .forEach(function (coordinate) {
                var ret = DygraphCoordinate({
                    prop: coordinate
                }, "prop");
                expect(ret).not.to.be.an.instanceOf(Error);
                expect(ret).to.equal(null);
            });
    });

});
