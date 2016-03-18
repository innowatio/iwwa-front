import "unit-setup.js";

import {fromJS} from "immutable";
import moment from "moment";
import {fromPairs, map, pipe, range, repeat} from "ramda";

import readingsDailyAggregatesToHighchartsData from "lib/readings-daily-aggregates-to-highcharts-data";

describe("readingsDailyAggregatesToHighchartsData", () => {

    it("readings-daily-aggtregates -> highcharts data structure [CASE: sources-and-sensors-compare]", () => {

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

        const filters = [
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
                    start: moment.utc("2015-01-01").valueOf(),
                    end: moment.utc("2015-01-31").valueOf(),
                    type: "dateFilter"
                }
            }
        ];

        const start = Date.now();
        console.log("Start");
        const result = readingsDailyAggregatesToHighchartsData(
            readingsDailyAggregates,
            filters
        );
        console.log(`Result in ${Date.now() - start}ms`);
        expect(result).to.be.an("array");
    });

    // it("readings-daily-aggtregates -> highcharts data structure [CASE: date-compare]", () => {
    //
    //     const padLeft = n => (n < 10 ? `0${n}` : `${n}`);
    //     const measurementsString = idx => repeat(1 * idx, 288).join(",");
    //
    //     const readingsDailyAggregates = pipe(
    //         map(idx => {
    //             const sensorId = `sensor_${idx % 5}`;
    //             const day = `2015-${padLeft((idx % 3) + 1)}-${padLeft((idx % 28) + 1)}`;
    //             const _id = `${sensorId}-${day}-reading-activeEnergy`;
    //             return [_id, {
    //                 _id,
    //                 sensorId,
    //                 // Only testing Janury for now
    //                 day,
    //                 source: "reading",
    //                 measurementType: "activeEnergy",
    //                 measurementValues: measurementsString(idx%5 + 1),
    //                 measurementsDeltaInMs: 300000
    //             }];
    //         }),
    //         fromPairs,
    //         fromJS
    //     )(range(0, 310));
    //
    //     const filters = [
    //         {
    //             sensorId: "sensor_1",
    //             source: {
    //                 key: "reading"
    //             },
    //             measurementType: {
    //                 key: "activeEnergy"
    //             },
    //             date: {
    //                 start: moment.utc("2015-03-28").subtract(4, "weeks").valueOf(),
    //                 end: moment.utc("2015-03-28").valueOf(),
    //                 type: "dateCompare",
    //                 period: {label: "Mese", key: "months"}
    //             }
    //         },
    //         {
    //             sensorId: "sensor_1",
    //             source: {
    //                 key: "reading"
    //             },
    //             measurementType: {
    //                 key: "activeEnergy"
    //             },
    //             date: {
    //                 start: moment.utc("2015-03-28").subtract(8, "weeks").valueOf(),
    //                 end: moment.utc("2015-03-28").subtract(4, "weeks").valueOf(),
    //                 type: "dateCompare",
    //                 period: {label: "Mese", key: "months"}
    //             }
    //         }
    //     ];
    //
    //     const start = Date.now();
    //     console.log("Start");
    //     const result = readingsDailyAggregatesToHighchartsData(
    //         readingsDailyAggregates,
    //         filters
    //     );
    //     console.log(`Result in ${Date.now() - start}ms`);
    //     expect(result).to.be.an("array");
    // });

});
