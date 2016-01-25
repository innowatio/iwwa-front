import {combineReducers} from "redux";

import {SELECT_REAL_TIME_SITE} from "../actions/real-time";

/**
*   A click to select a siteId
*   @param {Array} fullPath - full path of the selected item
*   (i.e. [Site, Pod, Sensor])
*/
function site (state = null, {type, payload}) {
    switch (type) {
    case SELECT_REAL_TIME_SITE:
        return payload.site;
    default:
        return state;
    }
}

function fullPath (state = null, {type, payload}) {
    switch (type) {
    case SELECT_REAL_TIME_SITE:
        return payload.fullPath;
    default:
        return state;
    }
}

export const realTime = combineReducers({
    site,
    fullPath
});
