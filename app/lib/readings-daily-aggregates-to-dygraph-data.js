import {findIndex, last, memoize, prop, reduce, sortBy, values} from "ramda";
import moment from "moment";

import decimate from "./decimate-data-to-dygraph";

export const EMPTY = Symbol("EMPTY");
export const ALMOST_ZERO = 0.01;
const ONE_MINUTE_IN_MILLISECOND = 60 * 1000;

function getFilterFn (filter) {
    return memoize(aggregate => (
        aggregate.get("sensorId") === filter.sensorId &&
        aggregate.get("source") === filter.source.key &&
        aggregate.get("measurementType") === filter.measurementType.key &&
        (filter.date.start ? moment(aggregate.get("day")).isSameOrAfter(filter.date.start) : true) &&
        (filter.date.end ? moment(aggregate.get("day")).isSameOrBefore(filter.date.end) : true)
    ));
}

function getFindAggregateFilterIndex (filters) {
    const filterFns = filters.map(getFilterFn);
    return aggregate => findIndex(filterFn => filterFn(aggregate), filterFns);
}

function getOffsetDays (aggregate, filters, index) {
    const day = moment(aggregate.get("day")).valueOf();
    return filters[0].date.type === "dateCompare" ?
    moment(day).diff(moment(filters[index].date.start)) :
    day;
}

export function groupByDate (filters) {
    const defaultGroup = filters.map(() => [ALMOST_ZERO]);
    const findAggregateFilterIndex = getFindAggregateFilterIndex(filters);
    return (group, aggregate) => {
        const index = findAggregateFilterIndex(aggregate);
        if (index === -1) {
            return group;
        }
        const offsetDays = getOffsetDays(aggregate, filters, index);
        const measurementsDeltaInMs = aggregate.get("measurementsDeltaInMs");
        const measurementValuesArray = aggregate.get("measurementValues").split(",");
        measurementValuesArray.forEach((value, offset) => {
            const date = offsetDays + (offset * measurementsDeltaInMs) + (moment().utcOffset() * ONE_MINUTE_IN_MILLISECOND);
            group[date] = group[date] || [new Date(date)].concat(defaultGroup);
            const numericValue = parseFloat(value);
            group[date][index + 1] = [
                numericValue ||
                (numericValue === 0 ? ALMOST_ZERO : EMPTY)
            ];
        });
        return group;
    };

}

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

export default memoize(function readingsDailyAggregatesToDygraphData (aggregates, filters) {
    const group = aggregates.reduce(groupByDate(filters), {});
    const filledData = fillMissingData(
        sortBy(prop(0), values(group))
    );
    return decimate(filledData);
});
