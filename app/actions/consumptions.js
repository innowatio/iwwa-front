import {struct} from "tcomb";

import actionTypeValidator from "../lib/action-type-validator";

export const SELECT_CONSUMPTIONS_SITE = "SELECT_CONSUMPTIONS_SITE";

const typeofSelectSite = actionTypeValidator(
    struct({
        fullPath: Array
    })
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
