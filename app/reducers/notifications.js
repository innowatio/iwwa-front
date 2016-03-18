import {combineReducers} from "redux";

import {SHOW_NOTIFICATION_MODAL} from "actions/notifications";
import {CLOSE_NOTIFICATION_MODAL} from "actions/notifications";

function data (state = null, {type, payload}) {
    switch (type) {
        case SHOW_NOTIFICATION_MODAL:
            return payload;
        default:
            return state;
    }
}

function showModal (state = false, {type}) {
    switch (type) {
        case SHOW_NOTIFICATION_MODAL:
            return true;
        case CLOSE_NOTIFICATION_MODAL:
            return false;
        default:
            return state;
    }
}

export const notifications = combineReducers({
    data,
    showModal
});
