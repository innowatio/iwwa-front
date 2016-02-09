import {combineReducers} from "redux";

import {SELECT_THEME_COLOR} from "../actions/user-setting";

const defalutTemplateState = {
    color: "dark"
};
function theme (state = defalutTemplateState, {type, payload}) {
    switch (type) {
    case SELECT_THEME_COLOR:
        return {
            ...state,
            color: payload
        };
    default:
        return state;
    }
}

export const userSetting = combineReducers({
    theme
});
