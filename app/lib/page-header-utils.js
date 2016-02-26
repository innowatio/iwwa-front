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
        const momentNow = moment.utc();
        return `${momentNow.format("MMM YYYY")} & ${momentNow.subtract(1, date.period.key).format("MMM YYYY")}`;
    } else {
        return `${moment.utc(date.end).format("MMM YYYY")}`;
    }
}

export function getSensorName (sensorId, collections) {
    return collections.getIn(["sensors", sensorId, "description"]) || sensorId;
}

function getSiteName (siteId, collections) {
    return collections.getIn(["sites", siteId, "name"]);
}
