import {combineReducers} from "redux";

import {
    SELECT_SINGLE_ELECTRICAL_SENSOR_CONSUMPTION,
    SELECT_CONSUMPTIONS_PERIOD
} from "../actions/consumptions";
import {SELECT_SINGLE_ELECTRICAL_SENSOR_CHART} from "actions/chart";
import {SELECT_SINGLE_ELECTRICAL_SENSOR_REAL_TIME} from "actions/real-time";

/**
*   A click to select a siteId
*   @param {Array} fullPath - full path of the selected item
*   (i.e. [Site, Pod, Sensor])
*/
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

function period (state = null, {type, payload}) {
    switch (type) {
        case SELECT_CONSUMPTIONS_PERIOD:
            return payload;
        default:
            return state;
    }
}


export const consumptions = combineReducers({
    fullPath,
    period
});
