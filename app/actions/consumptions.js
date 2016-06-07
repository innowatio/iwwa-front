import {list, String} from "tcomb";
import actionTypeValidator from "redux-action-type-validator";

export const SELECT_SINGLE_ELECTRICAL_SENSOR_CONSUMPTION = "SELECT_SINGLE_ELECTRICAL_SENSOR_CONSUMPTION";
export const SELECT_CONSUMPTIONS_PERIOD = "SELECT_CONSUMPTIONS_PERIOD";

const typeofSelectSite = actionTypeValidator(list(String));
export function selectSite (fullPath) {
    typeofSelectSite(...arguments);
    return {
        type: SELECT_SINGLE_ELECTRICAL_SENSOR_CONSUMPTION,
        payload: fullPath
    };
}

const typeofSelectPeriod = actionTypeValidator(String);
export function selectPeriod (period) {
    typeofSelectPeriod(...arguments);
    return {
        type: SELECT_CONSUMPTIONS_PERIOD,
        payload: period
    };
}
