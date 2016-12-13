import axios from "axios";
import {
    Object as object,
    Number,
    String
} from "tcomb";

import actionTypeValidator from "redux-action-type-validator";

import {WRITE_API_ENDPOINT} from "../lib/config";

export const DISPLAY_ALARMS_ON_CHART = "DISPLAY_ALARMS_ON_CHART";
export const SELECT_ALARM_RESET = "SELECT_ALARM_RESET";
export const NUMBER_OF_SELECTED_TABS = "NUMBER_OF_SELECTED_TABS";
export const FILTER_COLLECTION = "FILTER_COLLECTION";
export const RESET_FILTER = "RESET_FILTER";

export const SELECT_ALARM = "SELECT_ALARM";

export function selectAlarm (alarm) {
    return (dispatch) => {
        dispatch({
            type: SELECT_ALARM,
            payload: alarm
        });
    };
}

/**
*   Reset of the alarm form view
*/
export function resetSelectAlarm () {
    return {
        type: SELECT_ALARM_RESET
    };
}

export const ALARM_UPSERT_START = "ALARM_UPSERT_START";
export const ALARM_UPSERT_SUCCESS = "ALARM_UPSERT_SUCCESS";
export const ALARM_UPSERT_ERROR = "ALARM_UPSERT_ERROR";
export const ALARM_UPSERT_RESET = "ALARM_UPSERT_RESET";

export function upsertAlarm ({_id, name, userId, sensorId, rule, type, thresholdRule, threshold, unitOfMeasurement, measurementType, email}) {
    return (dispatch) => {

        dispatch({
            type: ALARM_UPSERT_START
        });

        const alarm = {
            name,
            userId,
            sensorId,
            rule,
            type,
            thresholdRule,
            threshold,
            unitOfMeasurement,
            measurementType,
            email
        };

        dispatch({
            type: SELECT_ALARM,
            payload: alarm
        });

        if (_id) {
            axios.put(`https://${WRITE_API_ENDPOINT}/alarms/${_id}`, alarm)
                .then(() => dispatch({
                    type: ALARM_UPSERT_SUCCESS
                }))
                .catch(() => dispatch({
                    type: ALARM_UPSERT_ERROR
                }));
        } else {
            axios.post(`https://${WRITE_API_ENDPOINT}/alarms/`, alarm)
                .then(() => dispatch({
                    type: ALARM_UPSERT_SUCCESS
                }))
                .catch(() => dispatch({
                    type: ALARM_UPSERT_ERROR
                }));
        }

        setTimeout(() => dispatch({
            type: ALARM_UPSERT_RESET
        }), 2000);
    };
}

/**
*   A click on tab
*   @param {number} selectedTab - index of the selected tab
*/
const typeofNumberOfSelectedTabs = actionTypeValidator(Number);
export function numberOfSelectedTabs (selectedTab) {
    typeofNumberOfSelectedTabs(...arguments);
    return {
        type: NUMBER_OF_SELECTED_TABS,
        payload: selectedTab
    };
}

/**
*   A click on tab
*   @param {number} selectedTab - index of the selected tab
*/
const typeofFilterCollection = actionTypeValidator(object, String);
export function filterCollection (filterSelection, collectionToFilter) {
    typeofFilterCollection(...arguments);
    return {
        type: FILTER_COLLECTION,
        payload: {
            filterSelection,
            collectionToFilter
        }
    };
}

export function resetFilter () {
    return {
        type: RESET_FILTER
    };
}
