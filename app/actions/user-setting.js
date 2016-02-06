import {String, struct} from "tcomb";

import actionTypeValidator from "../lib/action-type-validator";

export const USER_SETTING_FROM_DB = "USER_SETTING_FROM_DB";

const typeofGetUserSettingsFromDb = actionTypeValidator(
    struct({
        template: struct({
            color: String
        })
    })
);
export function getUserSettingsFromDb (userProfile) {
    typeofGetUserSettingsFromDb(...arguments);
    return {
        type: USER_SETTING_FROM_DB,
        payload: userProfile
    };
}
