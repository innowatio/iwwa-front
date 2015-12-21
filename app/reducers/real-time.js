import {combineReducers} from "redux";

import {SELECT_REAL_TIME_SITE} from "../actions/real-time";

/**
*   A click to select a siteId
*   @param {String} siteId - id of the site to display in real-time views
*/
function site (state = null, {type, payload}) {
    switch (type) {
    case SELECT_REAL_TIME_SITE:
        return payload[0];
    default:
        return state;
    }
}

export const realTime = combineReducers({
    site
});
