import {combineReducers} from "redux";

import {
    NUMBER_OF_SELECTED_TABS
} from "../actions/alarms";

function selectedTab (state = 3, {type, payload}) {
    switch (type) {
        case NUMBER_OF_SELECTED_TABS:
            return payload;
        default:
            return state;
    }
}

import {
    FILTER_COLLECTION,
    RESET_FILTER
} from "../actions/alarms";

const defaultFilter = {
    alarm: {
        status: "all"
    },
    notification: {
        period: "-1"
    }
};

function filter (state = defaultFilter, {type, payload}) {
    switch (type) {
        case FILTER_COLLECTION:
            return {
                ...state,
                [payload.collectionToFilter]: payload.filterSelection
            };
        case RESET_FILTER:
            return defaultFilter;
        default:
            return state;
    }
}

import {
    SELECT_ALARM,
    SELECT_ALARM_RESET
} from "../actions/alarms";

function selectedAlarm (state = {}, {type, payload}) {
    switch (type) {
        case SELECT_ALARM:
            return payload;
        case SELECT_ALARM_RESET:
            return {};
        default:
            return state;
    }
}

import {
    ALARM_UPSERT_SUCCESS,
    ALARM_UPSERT_ERROR,
    ALARM_UPSERT_RESET
} from "../actions/alarms";

function creationStatus (state = {}, {type}) {
    switch (type) {
        case ALARM_UPSERT_SUCCESS:
            return {success: true};
        case ALARM_UPSERT_ERROR:
            return {error: true};
        case ALARM_UPSERT_RESET:
            return {};
        default:
            return state;
    }
}

export const alarms = combineReducers({
    filter,
    selectedTab,
    selectedAlarm,
    creationStatus
});
