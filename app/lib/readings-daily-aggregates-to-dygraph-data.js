import moment from "moment";
import {findIndex, prop, sortBy, values} from "ramda";

var lastNotNull = 0.01;

function getFilterFn (filter) {
    return aggregate => (
        aggregate.get("sensorId") === filter.sensorId &&
        aggregate.get("source") === filter.source &&
        aggregate.get("measurementType") === filter.measurementType &&
        (filter.date.start ? moment(aggregate.get("day")).isSameOrAfter(filter.date.start) : true) &&
        (filter.date.end ? moment(aggregate.get("day")).isSameOrBefore(filter.date.end) : true)
    );
}

function getFindAggregateFilterIndex (filters) {
    const filterFns = filters.map(getFilterFn);
    return aggregate => findIndex(filterFn => filterFn(aggregate), filterFns);
}

function groupByDate (filters) {
    const defaultGroup = filters.map(() => [lastNotNull]);
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
            if (filters.length <= 1 && isNaN(parseFloat(value))) {
                return group;
            }
            const date = day + (offset * measurementsDeltaInMs);
            group[date] = group[date] || [new Date(date)].concat(defaultGroup);
            if (parseFloat(value) === 0 || isNaN(parseFloat(value))) {
                group[date][index + 1] = [lastNotNull];
            } else {
                lastNotNull = parseFloat(value);
                group[date][index + 1] = [parseFloat(value)] || [lastNotNull];
            }
        });
        return group;
    };
}

export default function readingsDailyAggregatesToDygraphData (aggregates, filters) {
    const group = aggregates.reduce(groupByDate(filters), {});
    return sortBy(prop(0), values(group));
}
