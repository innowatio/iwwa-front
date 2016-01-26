import moment from "moment";

export function getDateRangesCompare ({period, dateOne}) {
    if (period.key === "years") {
        return [{
            start: moment(dateOne).subtract(4, "weeks").startOf("day").valueOf(),
            end: moment(dateOne).endOf("day").valueOf()
        }, {
            start: moment(dateOne).subtract(57, "weeks").startOf("day").valueOf(),
            end: moment(dateOne).subtract(53, "weeks").endOf("day").valueOf()
        }];
    }
    if (period.key === "months") {
        return [{
            start: moment(dateOne).subtract(4, "weeks").startOf("day").valueOf(),
            end: moment(dateOne).endOf("day").valueOf()
        }, {
            start: moment(dateOne).subtract(8, "weeks").startOf("day").valueOf(),
            end: moment(dateOne).subtract(4, "weeks").endOf("day").valueOf()
        }];
    }
    return [{
        start: moment(dateOne).subtract(1, period.key).startOf("day").valueOf(),
        end: moment(dateOne).endOf("day").valueOf()
    }, {
        start: moment(dateOne).subtract(2, period.key).startOf("day").valueOf(),
        end: moment(dateOne).subtract(1, period.key).endOf("day").valueOf()
    }];
}
