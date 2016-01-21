import "unit-setup.js";

import {fromJS} from "immutable";
import moment from "moment";
import {fromPairs, map, pipe, range, repeat} from "ramda";

import readingsDailyAggregatesToDygraphData from "lib/readings-daily-aggregates-to-dygraph-data";

describe("readingsDailyAggregatesToDygraphData", () => {

    it("readings-daily-aggtregates -> dygraph data structure", () => {

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
                    // Only testing Janury for now
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
                sensorId: "sensor_3",
                source: "reading",
                measurementType: "activeEnergy",
                date: {
                    start: moment("2015-02-01").valueOf(),
                    end: moment("2015-02-28").valueOf()
                }
            },
            {
                sensorId: "sensor_3",
                source: "reading",
                measurementType: "activeEnergy",
                date: {
                    start: moment("2015-01-01").valueOf(),
                    end: moment("2015-01-31").valueOf()
                }
            }
        ];

        const start = Date.now();
        console.log("Start");
        const result = readingsDailyAggregatesToDygraphData(
            readingsDailyAggregates,
            filters
        );
        console.log(`Result in ${Date.now() - start}ms`);
        expect(result).to.be.an("array");
    });

});
