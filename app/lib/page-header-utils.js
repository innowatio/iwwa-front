import {isEmpty, isNil, last} from "ramda";
import moment from "moment";

export function getTitleForSingleSensor (reduxViewState, collections) {
    const path = reduxViewState.fullPath;
    if (isNil(path) || isEmpty(path)) {
        return "";
    }
    var res = [getSiteName(path[0], collections)];
    if (path.length > 1) {
        if (getSensorName(last(path), collections)) {
            res.push(getSensorName(last(path), collections));
        } else {
            res.push(last(path));
        }
    }
    return res.join(" · ");
}


export function getStringPeriod (date) {
    if (date.type === "dateCompare") {
        return getDateComparePeriod(date);
    } else {
        return `${moment.utc(date.end).format("MMMM YYYY")}`;
    }
}

export function getSensorName (sensorId, collections) {
    return collections.getIn(["sensors", sensorId, "description"]) || sensorId;
}

function getSiteName (siteId, collections) {
    return collections.getIn(["sites", siteId, "name"]);
}

function getDateComparePeriod (date) {
    const momentNow = moment.utc();
    switch (date.period.key) {
        case "7 days before":
            return `${momentNow.format("DD MMMM YYYY")} CON ${momentNow.subtract({days: 7}).format("DD MMMM YYYY")}`;
        case "months":
        case "years":
            return `${momentNow.format("MMMM YYYY")} CON ${momentNow.subtract(1, date.period.key).format("MMMM YYYY")}`;
        case "week":
            return `DAL ${moment.utc().subtract({days: 14}).format("DD MMMM YYYY")}
            AL ${moment.utc().subtract({days: 7}).format("DD MMMM YYYY")}` +
            ` E DAL ${moment.utc().subtract({days: 7}).format("DD MMMM YYYY")}
            AD OGGI`;
        default:
            return `${momentNow.format("DD MMMM YYYY")} CON ${momentNow.subtract(1, date.period.key).format("DD MMMM YYYY")}`;
    }
}
