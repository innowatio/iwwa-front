import {addIndex, findIndex, is, isEmpty, memoize, reduce, repeat} from "ramda";
import moment from "moment";

const oneDayInMs = moment.duration(1, "day").asMilliseconds();
const NUMBER_OF_DATA_IN_DAY = 288;

function getFilterFn (filter) {
    return memoize(aggregate => (
        aggregate.get("sensorId") === filter.sensorId &&
        aggregate.get("source") === filter.source.key &&
        aggregate.get("measurementType") === filter.measurementType.key &&
        (filter.date.start ? moment.utc(aggregate.get("day")).isSameOrAfter(filter.date.start) : true) &&
        (filter.date.end ? moment.utc(aggregate.get("day")).isSameOrBefore(filter.date.end) : true)
    ));
}

const indexedReduce = addIndex(reduce);

function getFindAggregateFilterIndex (filters) {
    const filterFns = filters.map(getFilterFn);
    return aggregate => (
        filters[0].date.type !== "dateCompare" ?
        findIndex(filterFn => filterFn(aggregate), filterFns) :
        indexedReduce((acc, filterFn, index) => {
            filterFn(aggregate) ? acc.push(index) : acc;
            return acc;
        }, [], filterFns)
    );
}

export function yAxisByDate (filters) {
    const findAggregateFilterIndex = getFindAggregateFilterIndex(filters);
    return (yAxis, aggregate) => {
        var indexes = findAggregateFilterIndex(aggregate);
        if (indexes === -1 || isEmpty(indexes)) {
            return yAxis;
        }
        indexes = is(Number, indexes) ? [indexes] : indexes;
        indexes.forEach(index => {
            const offsetDays = moment(aggregate.get("day")).diff(filters[index].date.start, "days");
            return aggregate
                .get("measurementValues")
                .split(",")
                .map(value => parseFloat(value))
                .forEach((value, offset) => {
                    const offsetInArray = (offsetDays * NUMBER_OF_DATA_IN_DAY) + offset;
                    return isNaN(value) ?
                        yAxis :
                        yAxis[index][offsetInArray] = value;
                });
        });
        return yAxis;
    };

}

export default memoize(function readingsDailyAggregatesToDygraphData (aggregates, filters) {
    const defaultYAxis = filters.map(filter => {
        const numberOfDaysToChart = (filter.date.end - filter.date.start) / oneDayInMs + 1;
        return repeat(null, numberOfDaysToChart * NUMBER_OF_DATA_IN_DAY);
    });
    const arraysOfData = aggregates.sortBy(a => a.get("day")).reduce(yAxisByDate(filters), defaultYAxis);
    return arraysOfData.map((arrayOfData, index) => ({
        data: arrayOfData,
        pointStart: new Date(filters[index].date.start),
        pointInterval: NUMBER_OF_DATA_IN_DAY
    }));
});
