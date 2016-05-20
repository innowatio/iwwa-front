import "unit-setup.js";

import {fromJS} from "immutable";
import moment from "moment";
import {fromPairs, map, pipe, range, repeat} from "ramda";

import readingsDailyAggregatesToHighchartsData from "lib/readings-daily-aggregates-to-highcharts-data";

describe("readingsDailyAggregatesToHighchartsData", () => {

    const padLeft = n => (n < 10 ? `0${n}` : `${n}`);
    const measurementsString = idx => repeat(1 * idx, 288).join(",");

    const readingsDailyAggregates = pipe(
        map(idx => {
            const sensorId = `sensor_${idx % 5}`;
            const day = `2015-${padLeft((idx % 3) + 1)}-${padLeft((idx % 28) + 1)}`;
            const _id = `${sensorId}-${day}-reading-activeEnergy`;
            return [_id, {
                _id,
                sensorId,
                day,
                source: "reading",
                measurementType: "activeEnergy",
                measurementValues: measurementsString(idx%5 + 1),
                measurementsDeltaInMs: 300000
            }];
        }),
        fromPairs,
        fromJS
    )(range(0, 310));

    const filtersSitesCompare = [
        {
            sensorId: "sensor_2",
            source: {
                key: "reading"
            },
            measurementType: {
                key: "activeEnergy"
            },
            date: {
                start: moment.utc("2015-02-01").valueOf(),
                end: moment.utc("2015-02-28").valueOf(),
                type: "dateFilter"
            }
        },
        {
            sensorId: "sensor_3",
            source: {
                key: "reading"
            },
            measurementType: {
                key: "activeEnergy"
            },
            date: {
                start: moment.utc("2015-02-01").valueOf(),
                end: moment.utc("2015-02-28").valueOf(),
                type: "dateFilter"
            }
        }
    ];

    const filtersDateCompare = [
        {
            sensorId: "sensor_1",
            source: {
                key: "reading"
            },
            measurementType: {
                key: "activeEnergy"
            },
            date: {
                start: moment.utc("2015-03-28").subtract(4, "weeks").valueOf(),
                end: moment.utc("2015-03-28").valueOf(),
                type: "dateCompare",
                period: {label: "Mese", key: "months"}
            }
        },
        {
            sensorId: "sensor_1",
            source: {
                key: "reading"
            },
            measurementType: {
                key: "activeEnergy"
            },
            date: {
                start: moment.utc("2015-03-28").subtract(8, "weeks").valueOf(),
                end: moment.utc("2015-03-28").subtract(4, "weeks").valueOf(),
                type: "dateCompare",
                period: {label: "Mese", key: "months"}
            }
        }
    ];

    const filtersSourcesAndSensors = [{
        ...filtersDateCompare[0],
        date: {
            start: moment.utc("2015-03-01").valueOf(),
            end: moment.utc("2015-03-03").valueOf(),
            type: "dateFilter"
        }
    }];

    describe("`readingsDailyAggregatesToHighchartsData` function", () => {

        it("readings-daily-aggregates -> highcharts data structure [CASE: sources-and-sensors-compare & sites-compare]", () => {
            const start = Date.now();
            const res = readingsDailyAggregatesToHighchartsData(
                readingsDailyAggregates,
                filtersSitesCompare
            );
            console.log(`Result in ${Date.now() - start}ms`);
            expect(res).to.be.an("array");
            res.map((objectResult, index) => {
                expect(res[index]).to.be.an("object");
                expect(res[index]).to.have.all.keys(["data", "name", "pointStart", "pointInterval"]);
                expect(objectResult.data).to.be.an("array");
                expect(objectResult.pointStart).to.equal(
                    moment.utc(filtersSitesCompare[index].date.start).valueOf()
                );
                expect(objectResult.pointInterval).to.equal(300000);
            });
        });

        it("readings-daily-aggregates -> highcharts data structure [CASE: date-compare]", () => {
            const start = Date.now();
            const res = readingsDailyAggregatesToHighchartsData(
                readingsDailyAggregates,
                filtersDateCompare
            );
            console.log(`Result in ${Date.now() - start}ms`);
            expect(res).to.be.an("array");
            res.map((objectResult, index) => {
                expect(res[index]).to.be.an("object");
                expect(res[index]).to.have.all.keys(["data", "name", "pointStart", "pointInterval"]);
                expect(objectResult.data).to.be.an("array");
                expect(objectResult.pointStart).to.equal(
                    moment.utc(filtersDateCompare[index].date.start).valueOf()
                );
                expect(objectResult.pointInterval).to.be.equal(300000);
            });
        });

        describe("`data` array", () => {

            it("should be an array of correct values", () => {
                const res = readingsDailyAggregatesToHighchartsData(
                    readingsDailyAggregates,
                    filtersSourcesAndSensors
                );
                expect(res[0].data).to.deep.equal(repeat(2, 864));
            });

        });

    });

    describe("`numberOfDayInFilter` function", () => {

        const numberOfDayInFilter = readingsDailyAggregatesToHighchartsData.__get__("numberOfDayInFilter");

        it("should return 0 if there is no date filter", () => {
            const dateFilter = [{date: {}}, {date: {}}];
            const ret = numberOfDayInFilter(dateFilter);
            expect(ret).to.equal(0);
        });

        it("should return the max number of day in date filter", () => {
            const dateFilter = [{
                date: {
                    start: moment("2016-01-01").startOf("day").valueOf(),
                    end: moment("2016-01-03").endOf("day").valueOf()
                }
            }, {
                date: {
                    start: moment("2016-01-01").startOf("day").valueOf(),
                    end: moment("2016-01-31").endOf("day").valueOf()
                }
            }, {
                date: {
                    start: moment("2016-01-01").startOf("day").valueOf(),
                    end: moment("2016-02-16").endOf("day").valueOf()
                }
            }];
            const ret = numberOfDayInFilter(dateFilter);
            expect(ret).to.equal(47);
        });

    });

    describe("`getFindAggregateFilterIndex` function", () => {

        const getFindAggregateFilterIndex = readingsDailyAggregatesToHighchartsData.__get__("getFindAggregateFilterIndex");
        const getReadingsDailyAggregate = (sensorId, _id, day) => fromJS({
            _id,
            sensorId,
            day,
            source: "reading",
            measurementType: "activeEnergy",
            measurementValues: measurementsString(4),
            measurementsDeltaInMs: 300000
        });

        it("should return the index of the filters [CASE: `filters[0].date.type !== 'dateCompare'`]", () => {
            const sensorId = "sensor_1";
            const day = "2016-03-11";
            const _id = "sensor_1-2016-03-11-reading-activeEnergy";
            const readingsDailyAggregate = getReadingsDailyAggregate(sensorId, _id, day);
            const findAggregateFilterIndex = getFindAggregateFilterIndex([{
                ...filtersDateCompare[0],
                date: {}
            }]);
            const ret = findAggregateFilterIndex(readingsDailyAggregate);
            expect(ret).to.be.a("number");
            expect(ret).to.equal(0);
        });

        it("should return the index of the filters [CASE: `filters[0].date.type === 'dateCompare'`]", () => {
            const sensorId = "sensor_1";
            const day = "2015-02-28";
            const _id = "sensor_1-2015-03-11-reading-activeEnergy";
            const readingsDailyAggregate = getReadingsDailyAggregate(sensorId, _id, day);
            const findAggregateFilterIndex = getFindAggregateFilterIndex(filtersDateCompare);
            const ret = findAggregateFilterIndex(readingsDailyAggregate);
            expect(ret).to.be.an("array");
            expect(ret).to.deep.equal([0, 1]);
        });

    });

});
