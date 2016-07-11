import {
    LOGGING_TO_SSO,
    LOGIN_FAIL,
    LOGIN_SUCCESS
} from "../actions/sso-auth";

const defaultState = {
    loginError: null
};

export const ssoAuth = (state = defaultState, action) => {
    switch (action.type) {
        case LOGGING_TO_SSO: {
            break;
        }
        case LOGIN_FAIL: {
            console.log("fail");
            console.log(action.payload);
            return {
                ...state,
                loginError: action.payload.message
            };
        }
        case LOGIN_SUCCESS: {
            console.log("success");
            console.log(action.payload);
            break;
        }
    }
    return state;
};