import {combineReducers} from "redux";
import {head} from "ramda";

import {SELECT_SINGLE_ELECTRICAL_SENSOR_REAL_TIME} from "actions/real-time";
import {SELECT_SINGLE_ELECTRICAL_SENSOR_CHART} from "actions/chart";
import {SELECT_SINGLE_ELECTRICAL_SENSOR_CONSUMPTION} from "actions/consumptions";

/**
*   A click to select a siteId
*   @param {Array} fullPath - full path of the selected item
*   (i.e. [Site, Pod, Sensor])
*/
function site (state = null, {type, payload}) {
    switch (type) {
        case SELECT_SINGLE_ELECTRICAL_SENSOR_CHART:
        case SELECT_SINGLE_ELECTRICAL_SENSOR_CONSUMPTION:
        case SELECT_SINGLE_ELECTRICAL_SENSOR_REAL_TIME:
            return head(payload);
        default:
            return state;
    }
}

function fullPath (state = null, {type, payload}) {
    switch (type) {
        case SELECT_SINGLE_ELECTRICAL_SENSOR_CHART:
        case SELECT_SINGLE_ELECTRICAL_SENSOR_CONSUMPTION:
        case SELECT_SINGLE_ELECTRICAL_SENSOR_REAL_TIME:
            return payload;
        default:
            return state;
    }
}

export const realTime = combineReducers({
    site,
    fullPath
});
