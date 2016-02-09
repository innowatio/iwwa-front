import moment from "moment";
import {map} from "ramda";

function numberOfWeeksToAdd (startOne, startTwo) {
    return (
        endDate(startOne, 5) < moment.utc(startOne).endOf("month") ||
        endDate(startTwo, 5) < moment.utc(startTwo).endOf("month")
    ) ? 6 : 5;
}
function endDate (startDate, numberOfWeeksToAdd) {
    return moment.utc(startDate).add({weeks: numberOfWeeksToAdd}).endOf("isoWeek").valueOf();
}
export function getDateRangesCompare ({period, dateOne}) {
    if (period.key === "years" || period.key === "months") {
        const startOne = moment.utc(dateOne).startOf("month").subtract({days: 2}).weekday(1).valueOf();
        const startTwo = period.key === "years" ?
            moment.utc(dateOne).subtract({weeks: moment.utc().weeksInYear() + 1}).weekday(1).valueOf() :
            moment.utc(dateOne).subtract({weeks: 6}).weekday(1).valueOf();
        const numberOfWeek = numberOfWeeksToAdd(startOne, startTwo);
        const dateArray = [startOne, startTwo];
        return map(dateStart => ({
            start: dateStart,
            end:  endDate(dateStart, numberOfWeek)
        }), dateArray);
    }
    return [];
}
