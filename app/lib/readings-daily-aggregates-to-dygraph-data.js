import moment from "moment";
import {findIndex, prop, sortBy, values} from "ramda";

const EMPTY = 0.01;

function getFilterFn (filter) {
    return aggregate => (
        aggregate.get("sensorId") === filter.sensorId &&
        aggregate.get("source") === filter.source &&
        aggregate.get("measurementType") === filter.measurementType &&
        moment(aggregate.get("day")).isSameOrAfter(filter.date.start) &&
        moment(aggregate.get("day")).isSameOrBefore(filter.date.end)
    );
}

function getFindAggregateFilterIndex (filters) {
    const filterFns = filters.map(getFilterFn);
    return aggregate => findIndex(filterFn => filterFn(aggregate), filterFns);
}

function groupByDate (filters) {
    const defaultGroup = filters.map(() => EMPTY);
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
            group[date][index + 1] = parseFloat(value) || EMPTY;
        });
        return group;
    };
}

export default function readingsDailyAggregatesToDygraphData (aggregates, filters) {
    const group = aggregates.reduce(groupByDate(filters), {});
    return sortBy(prop(0), values(group));
}
