import {last, memoize, prop, reduce, sortBy, values} from "ramda";

import decimate from "../decimate-data-to-dygraph";
import {groupByDate} from "./sources-and-sensors-compare";
import {groupForDateCompare} from "./date-compare";

export const EMPTY = Symbol("EMPTY");
export const ALMOST_ZERO = 0.01;

function fillMissingData (dygraphData) {
    return reduce((acc, dataPoint) => {
        const newDataPoint = [dataPoint[0]];
        dataPoint.slice(1).forEach(([value], index) => {
            newDataPoint[index + 1] = [
                value === EMPTY ?
                (last(acc) ? last(acc)[index + 1][0] : ALMOST_ZERO) :
                value
            ];
        });
        acc.push(newDataPoint);
        return acc;
    }, [], dygraphData);
}

export default memoize(function readingsDailyAggregatesToDygraphData (aggregates, filters, dateRanges) {
    const group = aggregates.reduce(dateRanges ? groupForDateCompare(filters, dateRanges) : groupByDate(filters), {});
    const filledData = fillMissingData(
        sortBy(prop(0), values(group))
    );
    return decimate(filledData);
});
