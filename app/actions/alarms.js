import axios from "axios";
import {
    Object as object,
    Boolean,
    Number,
    String,
    list,
    struct,
    tuple,
    maybe,
    union
} from "tcomb";
import {isEmpty} from "ramda";
import moment from "moment";

import actionTypeValidator from "../lib/action-type-validator";

export const DISPLAY_ALARMS_ON_CHART = "DISPLAY_ALARMS_ON_CHART";
export const MODIFY_EXISTENT_ALARM = "MODIFY_EXISTENT_ALARM";
export const RESET_ALARM_FORM_VIEW = "RESET_ALARM_FORM_VIEW";
export const CREATE_OR_MODIFY_ALARM_START = "CREATE_OR_MODIFY_ALARM_START";
export const CREATION_ALARM_STOP = "CREATION_ALARM_STOP";
export const NUMBER_OF_SELECTED_TABS = "NUMBER_OF_SELECTED_TABS";

// TODO: test this function
function less (time1, time2) {
    return (
        moment(time1, "hh:mm").toDate() <
        moment(time2, "hh:mm").toDate()
    );
}

// TODO: test this function
function creationRuleAlarm ({repetition, threshold}) {
    const rule = {
        $and: []
    };
    rule.$and.push({
        reale: {
            $gt: parseInt(threshold)
        }
    });
    if (!isEmpty(repetition.weekDays)) {
        rule.$and.push({
            "date.weekDay": {
                $in: repetition.weekDays
            }
        });
    }
    if (repetition.day) {
        const day = moment(repetition.day);
        rule.$and.push({
            "date.monthDay": day.date(),
            "date.month": day.month(),
            "date.year": day.year()
        });
    }
    const timeStart = moment(repetition.timeStart, "hh:mm");
    const timeEnd = moment(repetition.timeEnd, "hh:mm");
    if (!less(repetition.timeEnd, repetition.timeStart)) {
        rule.$and.push({
            "date.hour": {
                $lt: timeEnd.hour()
            }
        });
        rule.$and.push({
            "date.hour": {
                $gt: timeStart.hour()
            }
        });
    }
    return rule;
}

const typeofSubmitAlarmCreationOrChange = actionTypeValidator(
    struct({
        active: Boolean,
        name: maybe(String), // To correct this. If there isn't name, is not possible to submit
        repetition: struct({
            weekDays: list(Number),
            timeEnd: String,
            timeStart: String
        }),
        sito: object,
        threshold: union([String, Number])
    }),
    String,
    object
);
// TODO: test this function
export function submitAlarmCreationOrChange (
    {active, name, repetition, sito, threshold}, typeProps, alarmProps) {
    typeofSubmitAlarmCreationOrChange(...arguments);
    return dispatch => {
        dispatch({
            type: CREATE_OR_MODIFY_ALARM_START
        });
        const rule = creationRuleAlarm({active, name, repetition, sito, threshold});
        const alarm = {
            active,
            name,
            podId: sito.get("pod"),
            rule: JSON.stringify(rule),
            notifications: []
        };
        var requestBody;
        if (typeProps === "update") {
            requestBody = {
                method: "/alarms/replace",
                params: [alarmProps.get("_id"), alarm]
            };
        } else {
            requestBody = {
                method: "/alarms/insert",
                params: [alarm]
            };
        }
        var endpoint = WRITE_BACKEND_HOST + "/alarms";
        axios.post(endpoint, requestBody)
            .then(() => dispatch({
                type: CREATION_ALARM_STOP
            }))
            .catch(() => dispatch({
                type: CREATION_ALARM_STOP
            }));
    };
}

const typeofNumberOfSelectedTabs = actionTypeValidator(Number);
export function numberOfSelectedTabs (selectedTab) {
    typeofNumberOfSelectedTabs(...arguments);
    return {
        type: NUMBER_OF_SELECTED_TABS,
        payload: selectedTab
    };
}

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
export function displayAlarmsOnChart (sensorId, alarms, startDate, endDate) {
    typeofDisplayAlarmsOnChart(...arguments);
    return {
        type: DISPLAY_ALARMS_ON_CHART,
        payload: {
            sensorId,
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
