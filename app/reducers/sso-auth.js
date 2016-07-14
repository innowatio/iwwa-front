import {
    LOGGING_TO_SSO,
    LOGIN_FAIL,
    LOGOUT,
    VALID_TOKEN
} from "../actions/sso-auth";

const defaultState = {
    loginError: null,
    tokenId: null
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
        case LOGOUT:
            return defaultState;
        case VALID_TOKEN: {
            console.log("success");
            console.log(action.payload);
            return {
                ...state,
                loginError: null,
                tokenId: action.payload
            };
        }
    }
    return state;
};