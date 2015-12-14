import {String, Number, tuple, list} from "tcomb";

import actionTypeValidator from "../lib/action-type-validator";

export const DISPLAY_ALARMS_ON_CHART = "DISPLAY_ALARMS_ON_CHART";

const typeofDisplayAlarmsOnChart = actionTypeValidator(
    tuple([String]),
    list(Number),
    Number,
    Number
);
export function displayAlarmsOnChart (siteId, alarms, startDate, endDate) {
    typeofDisplayAlarmsOnChart(...arguments);
    return {
        type: DISPLAY_ALARMS_ON_CHART,
        payload: {
            siteId,
            alarms,
            startDate,
            endDate
        }
    };
}
