import {combineReducers} from "redux";

import {
    MODIFY_EXISTENT_ALARM,
    RESET_ALARM_FORM_VIEW
} from "../actions/alarms";

function id (state = null, {type, payload}) {
    switch (type) {
    case MODIFY_EXISTENT_ALARM:
        return payload;
    case RESET_ALARM_FORM_VIEW:
        return null;
    default:
        return state;
    }
}

export const alarms = combineReducers({
    id
});
