import {list, String} from "tcomb";

import actionTypeValidator from "../lib/action-type-validator";

export const SELECT_CONSUMPTIONS_SITE = "SELECT_CONSUMPTIONS_SITE";
export const SELECT_CONSUMPTIONS_PERIOD = "SELECT_CONSUMPTIONS_PERIOD";

const typeofSelectSite = actionTypeValidator(
    list(String)
);
export function selectSite (fullPath) {
    typeofSelectSite(...arguments);
    const ret = {
        type: SELECT_CONSUMPTIONS_SITE,
        payload: {
            fullPath
        }
    };
    return ret;
}

const typeofSelectPeriod = actionTypeValidator(
    String
);
export function selectPeriod (period) {
    typeofSelectPeriod(...arguments);
    const ret = {
        type: SELECT_CONSUMPTIONS_PERIOD,
        payload: {
            period
        }
    };
    return ret;
}
