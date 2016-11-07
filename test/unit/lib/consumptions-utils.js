import {tabParameters} from "lib/consumptions-utils";

describe("`consumptions-utils`", () => {

    var clock;

    before(() => {
        clock = sinon.useFakeTimers(new Date("2016-01-06").getTime());
    });

    after(() => {
        clock.restore();
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

});
