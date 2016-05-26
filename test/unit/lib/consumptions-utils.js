import {
    getTimeRangeByPeriod,
    getSumBySiteAndPeriod,
    tabParameters,
    getAverageBySiteAndPeriod
} from "lib/consumptions-utils";
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

        it("should return the sum of all values in a given range [on multiple years]", () => {
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
                    "measurementValues": "14.107,10,1,2,10",
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
            const periodRange = {
                start: "2015-01-01T00:00:00+00:00",
                end: "2016-01-03T23:59:59+00:00"
            };
            // 2nd + 3rd
            expect(getSumBySiteAndPeriod(periodRange, "site00022", measurements)).to.be.equals(625.107);
        });

    });

    describe("`tabParameters` function", () => {

        it("should return the proper array, based on `period` String value", () => {
            function mockFunc () {}
            const expected = [{
                key: "day",
                measureUnit: "kWh",
                now: mockFunc,
                period: "day",
                periodTitle: "OGGI HAI UTILIZZATO",
                periodSubtitle: "06 GENNAIO 2016",
                title: "OGGI",
                comparisons: [{
                    key: "today-1d",
                    title: "IERI",
                    max: mockFunc
                }, {
                    key: "today-7d",
                    title: "MERCOLEDÌ SCORSO",
                    max: mockFunc
                }, {
                    key: "avg-7d",
                    title: "MEDIA MERCOLEDÌ",
                    max: mockFunc
                }]
            }, {
                key: "week",
                measureUnit: "kWh",
                now: mockFunc,
                period: "week",
                periodTitle: "QUESTA SETTIMANA HAI UTILIZZATO",
                periodSubtitle: "03 - 10 GENNAIO 2016",
                title: "SETTIMANA CORRENTE",
                comparisons: [{
                    key: "week-1w",
                    title: "SETTIMANA SCORSA",
                    max: mockFunc
                }]
            }, {
                key: "month",
                measureUnit: "kWh",
                now: mockFunc,
                period: "month",
                periodTitle: "NEL MESE DI GENNAIO HAI UTILIZZATO",
                periodSubtitle: "2016",
                title: "MESE CORRENTE",
                comparisons: [{
                    key: "month-1m",
                    title: "DICEMBRE 2015",
                    max: mockFunc
                }, {
                    key: "month-1y",
                    title: "GENNAIO 2015",
                    max: mockFunc
                }, {
                    key: "avg-month",
                    title: "MEDIA DEI MESI",
                    max: mockFunc
                }]
            }, {
                key: "year",
                measureUnit: "kWh",
                now: mockFunc,
                period: "year",
                periodTitle: "NEL 2016 HAI UTILIZZATO",
                periodSubtitle: "2016",
                title: "ANNO CORRENTE",
                comparisons: [{
                    key: "year-1y",
                    title: "2015",
                    max: mockFunc
                }]
            }];

            const ret = tabParameters();
            expect(ret.length).to.equal(expected.length);
            // expect(ret).to.deep.equal(expected);
        });
    });

    describe("`getAverageBySiteAndPeriod` function", () => {

        it("should return the proper average, based on `period` and SensorId [period = 'day']", () => {
            const measurements = Immutable.Map({
                "site00022-2016-reading-activeEnergy": Immutable.Map({
                    "year": "2016",
                    "sensorId": "site00022",
                    "source": "reading",
                    "measurementType": "activeEnergy",
                    "measurementValues": "100,120,120,110,100,0",
                    "unitOfMeasurement": "kWh"
                }),
                "site00022-2015-reading-activeEnergy": Immutable.Map({
                    "year": "2015",
                    "sensorId": "site00022",
                    "source": "reading",
                    "measurementType": "activeEnergy",
                    "measurementValues": Array(359) + [100, 80, 80, 110, 90, 90],
                    "unitOfMeasurement": "kWh"
                })
            });

            expect(getAverageBySiteAndPeriod(1, "day", "site00022", measurements)).to.be.equals(100);
        });

        it("should return the proper average, based on `period` and SensorId [period = 'week']", () => {
            const values = [0, 0, 0, 0, 0, 0, 110] + Array(354) + [200, 220, 180, 210, 190, 200];
            const measurements = Immutable.Map({
                "site00022-2016-reading-activeEnergy": Immutable.Map({
                    "year": "2016",
                    "sensorId": "site00022",
                    "source": "reading",
                    "measurementType": "activeEnergy",
                    "measurementValues": "100,120,80,110,90,0",
                    "unitOfMeasurement": "kWh"
                }),
                "site00022-2015-reading-activeEnergy": Immutable.Map({
                    "year": "2015",
                    "sensorId": "site00022",
                    "source": "reading",
                    "measurementType": "activeEnergy",
                    "measurementValues": values,
                    "unitOfMeasurement": "kWh"
                })
            });

            expect(getAverageBySiteAndPeriod(7, "day", "site00022", measurements)).to.be.equals(150);
        });

        it("should return the proper average, based on `period` and SensorId [period = 'month']", () => {
            const values = [0, 0, 0, 200, 0, 200, 0] + Array(354) + [200, 220, 180, 210, 190, 200];
            const measurements = Immutable.Map({
                "site00022-2016-reading-activeEnergy": Immutable.Map({
                    "year": "2016",
                    "sensorId": "site00022",
                    "source": "reading",
                    "measurementType": "activeEnergy",
                    "measurementValues": "100,120,80,110,90,0",
                    "unitOfMeasurement": "kWh"
                }),
                "site00022-2015-reading-activeEnergy": Immutable.Map({
                    "year": "2015",
                    "sensorId": "site00022",
                    "source": "reading",
                    "measurementType": "activeEnergy",
                    "measurementValues": values,
                    "unitOfMeasurement": "kWh"
                })
            });

            expect(getAverageBySiteAndPeriod(1, "month", "site00022", measurements)).to.be.equals(800);
        });
    });
});
