import moment from "moment";
import {findIndex, memoize} from "ramda";

import {ALMOST_ZERO, EMPTY} from "./index";

function getFilterFn (filter) {
    return memoize(aggregate => (
        aggregate.get("sensorId") === filter.sensorId &&
        aggregate.get("source") === filter.source.key &&
        aggregate.get("measurementType") === filter.measurementType.key &&
        moment(aggregate.get("day")).isSameOrAfter(filter.date.start) &&
        moment(aggregate.get("day")).isSameOrBefore(filter.date.end))
    );
}

function getFindAggregateFilterIndex (filters) {
    const filterFns = filters.map(getFilterFn);
    return aggregate => findIndex(filterFn => filterFn(aggregate), filterFns);
}

export function groupForDateCompare (filters) {
    const defaultGroup = filters.map(() => [EMPTY]);
    const findAggregateFilterIndex = getFindAggregateFilterIndex(filters);
    return (group, aggregate) => {
        const index = findAggregateFilterIndex(aggregate);
        if (index === -1) {
            return group;
        }
        const offsetDay = moment(aggregate.get("day")).diff(moment(filters[index].date.start));
        const measurementsDeltaInMs = aggregate.get("measurementsDeltaInMs");
        const measurementValuesArray = aggregate.get("measurementValues").split(",");
        measurementValuesArray.forEach((value, offset) => {
            const date = offsetDay + (offset * measurementsDeltaInMs);
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
