import {String, tuple} from "tcomb";

import actionTypeValidator from "../lib/action-type-validator";

export const SELECT_REAL_TIME_SITE = "SELECT_REAL_TIME_SITE";

const typeofSelectRealTimeSite = actionTypeValidator(tuple([String]));
export function selectRealTimeSite (siteId) {
    typeofSelectRealTimeSite(...arguments);
    return {
        type: SELECT_REAL_TIME_SITE,
        payload: siteId
    };
}
