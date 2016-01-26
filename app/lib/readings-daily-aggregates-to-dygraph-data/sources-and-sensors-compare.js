import moment from "moment";
import {findIndex, memoize} from "ramda";

import {ALMOST_ZERO, EMPTY} from "./index";

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

export function groupByDate (filters) {
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
