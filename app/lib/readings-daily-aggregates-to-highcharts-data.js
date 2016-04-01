import {addIndex, findIndex, is, isEmpty, memoize, reduce, repeat} from "ramda";
import moment from "moment";
import max from "lodash.max";

const fiveMinutesInMs = moment.duration(5, "minutes").asMilliseconds();
const NUMBER_OF_DATA_IN_DAY = 288;
const DEFAULT_DAY_IN_FILTER = 0;

function getFilterFn (filter) {
    return memoize(aggregate => (
        aggregate.get("sensorId") === filter.sensorId &&
        aggregate.get("source") === filter.source.key &&
        aggregate.get("measurementType") === filter.measurementType.key &&
        (filter.date.start ? moment.utc(aggregate.get("day")).isSameOrAfter(filter.date.start) : true) &&
        (filter.date.end ? moment.utc(aggregate.get("day")).isSameOrBefore(filter.date.end) : true))
    );
}

const indexedReduce = addIndex(reduce);

function getFindAggregateFilterIndex (chartState) {
    const filterFns = chartState.map(getFilterFn);
    return aggregate => (
        chartState[0].date.type !== "dateCompare" ?
        findIndex(filterFn => filterFn(aggregate), filterFns) :
        indexedReduce((acc, filterFn, index) => {
            filterFn(aggregate) ? acc.push(index) : acc;
            return acc;
        }, [], filterFns)
    );
}

function numberOfDayInFilter (chartState) {
    const numberOfDayToFilter = chartState.map(
        ({date}) => Math.round(moment(date.end).diff(date.start, "days", true))
    );
    return max(numberOfDayToFilter) || DEFAULT_DAY_IN_FILTER;
}

export function yAxisByDate (chartState) {
    const findAggregateFilterIndex = getFindAggregateFilterIndex(chartState);
    return (yAxis, aggregate) => {
        var indexes = findAggregateFilterIndex(aggregate);
        if (indexes === -1 || isEmpty(indexes)) {
            return yAxis;
        }
        indexes = is(Number, indexes) ? [indexes] : indexes;
        indexes.forEach(index => {
            const offsetDays = moment(
                aggregate.get("day")
            ).diff(moment(chartState[index].date.start).format("YYYY-MM-DD"), "days");
            aggregate
                .get("measurementValues")
                .split(",")
                .map(value => parseFloat(value))
                .forEach((value, offset) => {
                    const offsetInArray = (offsetDays * NUMBER_OF_DATA_IN_DAY) + offset;
                    yAxis[index][offsetInArray] = isNaN(value) ? null : value;
                });
        });
        return yAxis;
    };
}

export default memoize(function readingsDailyAggregatesToHighchartsData (aggregates, chartState) {
    // Initialize the array of data because highcharts don't recognize undefined in array.
    const lengthOfData = numberOfDayInFilter(chartState) * NUMBER_OF_DATA_IN_DAY;
    const defaultYAxis = chartState.map(() => repeat(null, lengthOfData));
    const arraysOfData = aggregates.reduce(yAxisByDate(chartState), defaultYAxis);
    return arraysOfData.map((arrayOfData, index) => ({
        data: arrayOfData,
        pointStart: moment.utc(chartState[index].date.start).add({minutes: moment().utcOffset()}).valueOf(),
        pointInterval: fiveMinutesInMs
    }));
});
