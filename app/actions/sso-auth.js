import axios from "axios";

export const LOGGING_TO_SSO = "LOGGING_TO_SSO";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";

export const login = (credentials) => {
    return dispatch => {
        dispatch({
            type: LOGGING_TO_SSO
        });
        //TODO sso domain endpoint to put as env attr 
        var endpoint = "https://sso.innowatio.it/openam/json/authenticate";
        var config = {
            headers: {
                "X-OpenAM-Username": credentials.email,
                "X-OpenAM-Password": credentials.password
            }
        };
        axios.post(endpoint, {}, config)
            .then((result) => dispatch({
                type: LOGIN_SUCCESS,
                payload: result
            }))
            .catch((error) => dispatch({
                type: LOGIN_FAIL,
                payload: error
            }));
    };

};