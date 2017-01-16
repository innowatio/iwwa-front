import {map} from "ramda";
import moment from "lib/moment";

function numberOfWeeksToAdd (startOne, startTwo) {
    return (
        (endDate(startOne, 5).valueOf() < moment(startOne).add({week: 1}).endOf("month").valueOf()) ||
        (endDate(startTwo, 5).valueOf() < moment(startTwo).add({week: 1}).endOf("month").valueOf())
    ) ? 6 : 5;
}

function endDate (startDate, numberOfWeeks) {
    return moment(startDate).add({weeks: numberOfWeeks}).endOf("isoWeek").valueOf();
}

export function getDateRangesCompare ({period, dateOne}) {
    switch (period.key) {
        case "days": {
            const dateStartArray = [
                moment(dateOne).startOf(period.key).valueOf(),
                moment(dateOne).subtract(1, period.key).startOf(period.key).valueOf()
            ];
            return map(dateStart => ({
                start: dateStart,
                end: moment(dateStart).endOf(period.key).valueOf()
            }), dateStartArray);
        }
        case "week": {
            const dateStartArray = [
                moment(dateOne).startOf("isoWeek").valueOf(),
                moment(dateOne).subtract(1, period.key).startOf("isoWeek").valueOf()
            ];
            return map(dateStart => ({
                start: dateStart,
                end: moment(dateStart).endOf("isoWeek").valueOf()
            }), dateStartArray);
        }
        case "7 days before": {
            const dateStartArray = [
                moment(dateOne).startOf("day"),
                moment(dateOne).subtract({week: 1}).startOf("day")
            ];
            return map(dateStart => ({
                start: dateStart.valueOf(),
                end: dateStart.endOf("day").valueOf()
            }), dateStartArray);
        }
        case "years":
        case "months": {
            const startOne = moment(dateOne).startOf("month").startOf("isoWeek").valueOf();
            const startTwo = period.key === "years" ?
                moment(dateOne).subtract({year: 1}).startOf("month").startOf("isoWeek").valueOf() :
                moment(dateOne).startOf("month").subtract({weeks: 5}).startOf("isoWeek").valueOf();
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
