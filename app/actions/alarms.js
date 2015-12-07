import {String, Number, tuple, list} from "tcomb";

import actionTypeValidator from "../lib/action-type-validator";

export const DISPLAY_ALARMS_ON_CHART = "DISPLAY_ALARMS_ON_CHART";
export const MODIFY_EXISTENT_ALARM = "MODIFY_EXISTENT_ALARM";
export const RESET_ALARM_FORM_VIEW = "RESET_ALARM_FORM_VIEW";

/**
*   A click on button in alarms to display the alarms point in chart
*   @param {array} siteId - id of the site referred to by the alarm
*   @param {array} alarms - date of the date (in miliseconds unix timestamp)
*   @param {Number} startDate - start of the month of the alarms
*       (in miliseconds unix timestamp)
*   @param {Number} endDate - end of the month of the alarms
*       (in miliseconds unix timestamp)
*/
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

/**
*   A click to modify an alarm
*   @param {String} alarmId - id of the alarm to modify
*/
const typeofModifyExistentAlarm = actionTypeValidator(String);
export function modifyExistentAlarm (alarmId) {
    typeofModifyExistentAlarm(...arguments);
    return {
        type: MODIFY_EXISTENT_ALARM,
        payload: alarmId
    };
}

/**
*   Reset of the alarm form view
*/
export function resetAlarmFormView () {
    return {
        type: RESET_ALARM_FORM_VIEW
    };
}
