import {combineReducers} from "redux";

import {SELECT_CONSUMPTIONS_SITE} from "../actions/consumptions";

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

export const consumptions = combineReducers({
    fullPath
});
