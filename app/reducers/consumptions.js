import {combineReducers} from "redux";

import {SELECT_CONSUMPTIONS_SITE, SELECT_CONSUMPTIONS_PERIOD} from "../actions/consumptions";

/**
*   A click to select a siteId
*   @param {Array} fullPath - full path of the selected item
*   (i.e. [Site, Pod, Sensor])
*/
function fullPath (state = null, {type, payload}) {
    switch (type) {
    case SELECT_CONSUMPTIONS_SITE:
        return payload.fullPath;
    default:
        return state;
    }
}

function period (state = null, {type, payload}) {
    switch (type) {
    case SELECT_CONSUMPTIONS_PERIOD:
        return payload.period;
    default:
        return state;
    }
}


export const consumptions = combineReducers({
    fullPath,
    period
});
