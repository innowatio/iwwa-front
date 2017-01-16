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
            const values = measurementsString(idx % 5 + 1);
            const times = values.split(",").map((value, index) => {
                return moment(day).add({minutes: index}).valueOf();
            });
            return [_id, {
                _id,
                sensorId,
                day,
                source: "reading",
                measurementType: "activeEnergy",
                measurementValues: measurementsString(idx % 5 + 1),
                measurementTimes: times.join(",")
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
                start: moment("2015-02-01").valueOf(),
                end: moment("2015-02-28").valueOf(),
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
                start: moment("2015-02-01").valueOf(),
                end: moment("2015-02-28").valueOf(),
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
                start: moment("2015-03-28").subtract(4, "weeks").valueOf(),
                end: moment("2015-03-28").valueOf(),
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
                start: moment("2015-03-28").subtract(8, "weeks").valueOf(),
                end: moment("2015-03-28").subtract(4, "weeks").valueOf(),
                type: "dateCompare",
                period: {label: "Mese", key: "months"}
            }
        }
    ];

    const filtersSourcesAndSensors = [{
        ...filtersDateCompare[0],
        date: {
            start: moment("2015-03-01").valueOf(),
            end: moment("2015-03-03").valueOf(),
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
                expect(res[index]).to.have.all.keys(["data", "name", "unitOfMeasurement", "aggregationType"]);
                expect(objectResult.data).to.be.an("array");
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
                expect(res[index]).to.have.all.keys(["data", "name", "unitOfMeasurement", "aggregationType"]);
                expect(objectResult.data).to.be.an("array");
            });
        });

        describe("`data` array", () => {

            it("should be an array of correct values", () => {
                const res = readingsDailyAggregatesToHighchartsData(
                    readingsDailyAggregates,
                    filtersSourcesAndSensors
                );

                res.forEach((resource, resIndex) => {
                    const startTime = moment(filtersSourcesAndSensors[resIndex].date.start).valueOf();
                    const endTime = moment(filtersSourcesAndSensors[resIndex].date.end).endOf("day").valueOf();
                    resource.data.forEach(data => {
                        // due to a workaround, unit test has values not between start and end time
                        expect(data[1]).to.equal(data[0] < startTime || data[0] > endTime ? 0 : 2);
                    });
                });
            });
        });
    });
});
