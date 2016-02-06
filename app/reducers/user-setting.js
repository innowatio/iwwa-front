import {combineReducers} from "redux";

import {USER_SETTING_FROM_DB} from "../actions/user-setting";

const defalutTemplateState = {
    color: "dark"
};
function template (state = defalutTemplateState, {type, payload}) {
    switch (type) {
    case USER_SETTING_FROM_DB:
        return {
            ...state,
            color: payload.color
        };
    default:
        return state;
    }
}

export const userSetting = combineReducers({
    template
});
