import {String, list} from "tcomb";

import actionTypeValidator from "../lib/action-type-validator";

export const SELECT_SINGLE_ELECTRICAL_SENSOR_REAL_TIME = "SELECT_SINGLE_ELECTRICAL_SENSOR_REAL_TIME";

const typeofSelectRealTimeSite = actionTypeValidator(list(String));
export function selectRealTimeSite (fullPath) {
    typeofSelectRealTimeSite(...arguments);
    return {
        type: SELECT_SINGLE_ELECTRICAL_SENSOR_REAL_TIME,
        payload: fullPath
    };
}
