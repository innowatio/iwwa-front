import moment from "moment";
import {map} from "ramda";

function numberOfWeeksToAdd (startOne, startTwo) {
    return (
        endDate(startOne, 5) < moment(startOne).endOf("month") ||
        endDate(startTwo, 5) < moment(startTwo).endOf("month")
    ) ? 6 : 5;
}
function endDate (startDate, numberOfWeeksToAdd) {
    return moment(startDate).add({weeks: numberOfWeeksToAdd}).endOf("isoWeek").valueOf();
}
export function getDateRangesCompare ({period, dateOne}) {
    if (period.key === "years" || period.key === "months") {
        const startOne = moment(dateOne).startOf("month").day(1).valueOf();
        const startTwo = period.key === "years" ?
            moment(dateOne).subtract({weeks: moment().weeksInYear()}).startOf("isoWeek").valueOf() :
            moment(dateOne).subtract({weeks: 5}).startOf("isoWeek").valueOf();
        const numberOfWeek = numberOfWeeksToAdd(startOne, startTwo);
        const dateArray = [startOne, startTwo];
        console.log(numberOfWeek);
        console.log(dateArray);
        return map(dateStart => ({
            start: dateStart,
            end:  endDate(dateStart, numberOfWeek)
        }), dateArray);
    }
    return [{
        start: moment(dateOne).subtract(1, period.key).startOf("day").valueOf(),
        end: moment(dateOne).endOf("day").valueOf()
    }, {
        start: moment(dateOne).subtract(2, period.key).startOf("day").valueOf(),
        end: moment(dateOne).subtract(1, period.key).endOf("day").valueOf()
    }];
}
