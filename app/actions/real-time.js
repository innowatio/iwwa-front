import {String, struct} from "tcomb";

import actionTypeValidator from "../lib/action-type-validator";

export const SELECT_REAL_TIME_SITE = "SELECT_REAL_TIME_SITE";

const typeofSelectRealTimeSite = actionTypeValidator(
    struct({
        fullPath: Array,
        site: String
    })
);
export function selectRealTimeSite ({fullPath, site}) {
    typeofSelectRealTimeSite(...arguments);
    const ret = {
        type: SELECT_REAL_TIME_SITE,
        payload: {
            fullPath,
            site
        }
    };
    return ret;
}
