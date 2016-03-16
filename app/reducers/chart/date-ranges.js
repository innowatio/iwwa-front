import moment from "moment";
import {map} from "ramda";

function numberOfWeeksToAdd (startOne, startTwo) {
    return (
        (endDate(startOne, 5).valueOf() < moment.utc(startOne).add({week: 1}).endOf("month").valueOf()) ||
        (endDate(startTwo, 5).valueOf() < moment.utc(startTwo).add({week: 1}).endOf("month").valueOf())
    ) ? 6 : 5;
}

function endDate (startDate, numberOfWeeks) {
    return moment.utc(startDate).add({weeks: numberOfWeeks}).endOf("isoWeek").valueOf();
}

export function getDateRangesCompare ({period, dateOne}) {
    switch (period.key) {
        case "days": {
            const dateStartArray = [
                moment.utc(dateOne).startOf(period.key).valueOf(),
                moment.utc(dateOne).subtract(1, period.key).startOf(period.key).valueOf()
            ];
            return map(dateStart => ({
                start: dateStart,
                end: moment.utc(dateStart).endOf(period.key).valueOf()
            }), dateStartArray);
        }
        case "week": {
            const dateStartArray = [
                moment.utc(dateOne).startOf("isoWeek").valueOf(),
                moment.utc(dateOne).subtract(1, period.key).startOf("isoWeek").valueOf()
            ];
            return map(dateStart => ({
                start: dateStart,
                end: moment.utc(dateStart).endOf("isoWeek").valueOf()
            }), dateStartArray);
        }
        case "7 days before": {
            const dateStartArray = [
                moment.utc(dateOne).startOf("day"),
                moment.utc(dateOne).subtract({week: 1}).startOf("day")
            ];
            return map(dateStart => ({
                start: dateStart.valueOf(),
                end: dateStart.endOf("day").valueOf()
            }), dateStartArray);
        }
        case "years":
        case "months": {
            const startOne = moment.utc(dateOne).startOf("month").startOf("isoWeek").valueOf();
            const startTwo = period.key === "years" ?
                moment.utc(dateOne).subtract({year: 1}).startOf("month").startOf("isoWeek").valueOf() :
                moment.utc(dateOne).startOf("month").subtract({weeks: 5}).startOf("isoWeek").valueOf();
            const numberOfWeek = numberOfWeeksToAdd(startOne, startTwo);
            const dateStartArray = [startOne, startTwo];
            return map(dateStart => ({
                start: dateStart,
                end:  endDate(dateStart, numberOfWeek)
            }), dateStartArray);
        }
        default:
            return [];
    }
}
