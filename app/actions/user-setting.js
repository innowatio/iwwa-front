import {String, struct} from "tcomb";
import actionTypeValidator from "redux-action-type-validator";

export const SELECT_THEME_COLOR = "SELECT_THEME_COLOR";

const typeofselectThemeColor = actionTypeValidator(
    struct({
        key: String,
        label: String
    })
);
export function selectThemeColor (userProfile) {
    typeofselectThemeColor(...arguments);
    return {
        type: SELECT_THEME_COLOR,
        payload: userProfile.key
    };
}
