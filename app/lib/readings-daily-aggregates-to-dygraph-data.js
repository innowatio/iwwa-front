import moment from "moment";
import {
    addIndex,
    all,
    findIndex,
    identity,
    last,
    memoize,
    prop,
    reduce,
    sortBy,
    values
} from "ramda";

const EMPTY = Symbol("EMPTY");
const ALMOST_ZERO = 0.01;

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

function groupByDate (filters) {
    const defaultGroup = filters.map(() => [EMPTY]);
    const findAggregateFilterIndex = getFindAggregateFilterIndex(filters);
    return (group, aggregate) => {
        const index = findAggregateFilterIndex(aggregate);
        if (index === -1) {
            return group;
        }
        const day = moment(aggregate.get("day")).valueOf();
        const measurementsDeltaInMs = aggregate.get("measurementsDeltaInMs");
        const measurementValuesArray = aggregate.get("measurementValues").split(",");
        measurementValuesArray.forEach((value, offset) => {
            const date = day + (offset * measurementsDeltaInMs);
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



/*
*   Decimation algorithm
*   TODO move to a different file
*/

function isInRange (val1, val2) {
    return (
        val1 * 1.10 > val2 &&
        val1 * 0.90 < val2
    );
}

function areInRange (values1, values2) {
    const results = [];
    for (var i=0; i< values1.length; i++) {
        results.push(
            isInRange(values1[i], values2[i])
        );
    }
    return all(identity, results);
}

function getValues (dataPoint) {
    return dataPoint.slice(1).map(p => p[0]);
}

const indexedReduce = addIndex(reduce);

function decimate (dygraphData) {
    const length = dygraphData.length;
    return indexedReduce((acc, dataPoint, index) => {
        const needsToAdd = (
            index === 0 ||
            index === length - 1 ||
            !areInRange(getValues(last(acc)), getValues(dataPoint)) ||
            index % 24 === 12
        );
        if (needsToAdd) {
            acc.push(dataPoint);
        }
        return acc;
    }, [], dygraphData);
}

/*
*   Decimation algorithm - END
*   TODO move to a different file
*/



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
