require("unit-setup.js");

import {getTimeRangeByPeriod, getSumBySiteAndPeriod, tabParameters} from "lib/consumptions-utils";
import * as Immutable from "immutable";

describe("`consumptions-utils`", () => {

    var clock;

    before(() => {
        clock = sinon.useFakeTimers(new Date("2016-01-06").getTime());
    });

    after(() => {
        clock.restore();
    });

    describe("`getTimeRangeByPeriod` function", () => {

        it("should return the proper object", () => {

            var period = "day";
            const ret1 = getTimeRangeByPeriod(period);
            expect(ret1.start).to.be.equal("2016-01-06T00:00:00+00:00");
            expect(ret1.end).to.be.equal("2016-01-06T23:59:59+00:00");

            period = "week";
            const ret2 = getTimeRangeByPeriod(period);
            expect(ret2.start).to.be.equal("2016-01-03T00:00:00+00:00");
            expect(ret2.end).to.be.equal("2016-01-09T23:59:59+00:00");

            period = "month";
            const ret3 = getTimeRangeByPeriod(period);
            expect(ret3.start).to.be.equal("2016-01-01T00:00:00+00:00");
            expect(ret3.end).to.be.equal("2016-01-31T23:59:59+00:00");

            period = "year";
            const ret4 = getTimeRangeByPeriod(period);
            expect(ret4.start).to.be.equal("2016-01-01T00:00:00+00:00");
            expect(ret4.end).to.be.equal("2016-12-31T23:59:59+00:00");

            period = "somethingReallyUnexpected";
            const ret5 = getTimeRangeByPeriod(period);
            expect(ret5.start).to.be.equal("2016-01-06T00:00:00+00:00");
            expect(ret5.end).to.be.equal("2016-01-06T00:00:00+00:00");

        });

    });

    describe("`getSumBySiteAndPeriod` function", () => {

        it("should return the sum of all values in a given range", () => {
            const measurements = Immutable.Map({
                "site00022-2017-reading-activeEnergy": Immutable.Map({
                    "year": "2017",
                    "sensorId": "site00022",
                    "source": "reading",
                    "measurementType": "activeEnergy",
                    "measurementValues": "100,200,300,10",
                    "unitOfMeasurement": "kWh"
                }),
                "site00022-2016-reading-activeEnergy": Immutable.Map({
                    "year": "2016",
                    "sensorId": "site00022",
                    "source": "reading",
                    "measurementType": "activeEnergy",
                    "measurementValues": "14.107, 10,1,2,10",
                    "unitOfMeasurement": "kWh"
                }),
                "site00022-2015-reading-activeEnergy": Immutable.Map({
                    "year": "2015",
                    "sensorId": "site00022",
                    "source": "reading",
                    "measurementType": "activeEnergy",
                    "measurementValues": "500,,,,,,,,,,100",
                    "unitOfMeasurement": "kWh"
                }),
                "site00022-2014-reading-activeEnergy": Immutable.Map({
                    "year": "2014",
                    "sensorId": "site00022",
                    "source": "reading",
                    "measurementType": "activeEnergy",
                    "measurementValues": "10,10,10,10,,,,",
                    "unitOfMeasurement": "kWh"
                }),
                "site00021-2016-reading-activeEnergy": Immutable.Map({
                    "year": "2016",
                    "sensorId": "site00021",
                    "source": "reading",
                    "measurementType": "activeEnergy",
                    "measurementValues": "9,9,,,99",
                    "unitOfMeasurement": "kWh"
                }),
                "site00021-2015-reading-activeEnergy": Immutable.Map({
                    "year": "2015",
                    "sensorId": "site00021",
                    "source": "reading",
                    "measurementType": "activeEnergy",
                    "measurementValues": "14.666,19.1,,,1.23",
                    "unitOfMeasurement": "kWh"
                })
            });
            const period = {
                start: "2015-01-01",
                end: "2016-01-03"
            };
            // 2nd + 3rd
            expect(getSumBySiteAndPeriod(period, "site00022", measurements)).to.be.equals(625.107);
        });

    });

    describe("`tabParameters` function", () => {

        it("should return the proper array, based on `period` String value", () => {
            const expected = [{
                key: "day",
                measureUnit: "kWh",
                period: "day",
                periodTitle: "OGGI HAI UTILIZZATO",
                periodSubtitle: "06 GENNAIO 2016",
                title: "OGGI",
                comparisons: [{
                    key: "today-1d",
                    title: "IERI",
                    start: "2016-01-05T00:00:00+00:00",
                    end: "2016-01-05T23:59:59+00:00"
                }, {
                    key: "today-7d",
                    title: "MERCOLEDÌ SCORSO",
                    start: "2015-12-30T00:00:00+00:00",
                    end: "2015-12-30T23:59:59+00:00"
                }]
            }, {
                key: "week",
                measureUnit: "kWh",
                period: "week",
                periodTitle: "QUESTA SETTIMANA HAI UTILIZZATO",
                periodSubtitle: "03 - 10 GENNAIO 2016",
                title: "SETTIMANA CORRENTE",
                comparisons: [{
                    key: "week-1w",
                    title: "SETTIMANA SCORSA",
                    start: "2015-12-27T00:00:00+00:00",
                    end: "2016-01-02T23:59:59+00:00"
                }]
            }, {
                key: "month",
                measureUnit: "kWh",
                period: "month",
                periodTitle: "NEL MESE DI GENNAIO HAI UTILIZZATO",
                periodSubtitle: "2016",
                title: "MESE CORRENTE",
                comparisons: [{
                    key: "month-1m",
                    title: "DICEMBRE 2015",
                    start: "2015-12-01T00:00:00+00:00",
                    end: "2015-12-31T23:59:59+00:00"
                }, {
                    key: "month-1y",
                    title: "GENNAIO 2015",
                    start: "2015-01-01T00:00:00+00:00",
                    end: "2015-01-31T23:59:59+00:00"
                }]
            }, {
                key: "year",
                measureUnit: "kWh",
                period: "year",
                periodTitle: "NEL 2016 HAI UTILIZZATO",
                periodSubtitle: "2016",
                title: "ANNO CORRENTE",
                comparisons: [{
                    key: "year-1y",
                    title: "2015",
                    start: "2015-01-01T00:00:00+00:00",
                    end: "2015-12-31T23:59:59+00:00"
                }]
            }];

            const ret = tabParameters();
            expect(ret).to.deep.equal(expected);
        });

    });
});
