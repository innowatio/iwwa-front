import moment from "moment";
import {findIndex, memoize, partial} from "ramda";

import {ALMOST_ZERO, EMPTY} from "./index";

function getFilterFn (filter, dateRanges) {
    return memoize(aggregate => (
        aggregate.get("sensorId") === filter.sensorId &&
        aggregate.get("source") === filter.source.key &&
        aggregate.get("measurementType") === filter.measurementType.key &&
        (
            moment(aggregate.get("day")).isSameOrAfter(dateRanges.rangeOne.start) ||
            moment(aggregate.get("day")).isSameOrBefore(dateRanges.rangeOne.end)
        ) &&
        (
            moment(aggregate.get("day")).isSameOrAfter(dateRanges.rangeTwo.start) ||
            moment(aggregate.get("day")).isSameOrBefore(dateRanges.rangeTwo.end)
        )
    ));
}

function getFindAggregateFilterIndex (filters, dateRanges) {
    const filterFns = filters.map(partial(getFilterFn, [dateRanges]));
    return aggregate => findIndex(filterFn => filterFn(aggregate), filterFns);
}

export function groupForDateCompare (filters, dateRanges) {
    const defaultGroup = filters.map(() => [EMPTY]);
    const findAggregateFilterIndex = getFindAggregateFilterIndex(filters, dateRanges);
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
