import axios from "axios";

export const LOGGING_TO_SSO = "LOGGING_TO_SSO";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT = "LOGOUT";
export const VALID_TOKEN = "VALID_TOKEN";

export const login = (credentials) => {
    return dispatch => {
        dispatch({
            type: LOGGING_TO_SSO
        });
        //TODO sso domain endpoint to put as env attr 
        const endpoint = "https://sso.innowatio.it/openam/json/authenticate";
        const config = {
            headers: {
                "X-OpenAM-Username": credentials.username,
                "X-OpenAM-Password": credentials.password,
                "Authorization": "Basic ZGVtbzpjaGFuZ2VpdA==",
                "Content-Type": "application/json"
            }
        };
        axios.post(endpoint, {}, config)
            .then(result => validateToken(result.tokenId))
            .catch(() => dispatch(
                //TODO remove when authenticate API is fixed
                validateToken("AQIC5wM2LY4SfcyOxGB50j79ClWq1gZUQIqC7oXwzfQ_yFo.*AAJTSQACMDEAAlNLABMzNzM3MjMxNTY5NTI1NTg3Mjc0AAJTMQAA*")
                // {
                //     type: LOGIN_FAIL,
                //     payload: error
                // }
            ));
    };

};

export const logout = () => {
    //TODO do right things...
    return {
        type: LOGOUT
    };
};

const validateToken = (tokenId) => {
    return dispatch => {
        dispatch({
            type: "VALIDATING_TOKEN"
        });
        //TODO sso domain endpoint to put as env attr
        const endpoint = "https://sso.innowatio.it/openam/json/sessions/" + tokenId + "?_action=validate";
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        axios.post(endpoint, {}, config)
            .then(result => {
                if (result.data.valid) {
                    setTokenOnInnowatioSSO(tokenId);
                    dispatch({
                        type: VALID_TOKEN,
                        payload: tokenId
                    });
                } else {
                    dispatch({
                        type: "INVALID_TOKEN"
                    });
                }
            })
            .catch(error => dispatch({
                type: "INVALID_TOKEN",
                payload: error
            }));
    };
};

const setTokenOnInnowatioSSO = (tokenId) => {
    console.log("setting token on innowatio.it");
    const endpoint = "https://sso.innowatio.it/tokenId";
    axios.post(endpoint, {
        tokenId: tokenId
    })
        .then(() => console.log("success"))
        .catch(() => console.log("error"));
};


// TODO from official innowatio sso js
// window.InnowatioSSO.setTokenId = function (tokenId, callback) {
//     $.ajax({
//         url: 'https://sso.innowatio.it/tokenId'
//         , method: 'POST'
//         , data: {tokenId: tokenId}
//         , xhrFields: {
//             withCredentials: true
//         }
//         , success: function (data, textStatus, jqXHR) {
//             if (callback) {
//                 callback(data.tokenId);
//             }
//         }
//     });
// };
//
// window.InnowatioSSO.unsetTokenId = function (callback) {
//     window.InnowatioSSO.setTokenId("NULL", callback);
// };
//
// window.InnowatioSSO.getTokenId = function (callback) {
//     $.ajax({
//         url: 'https://sso.innowatio.it/tokenId'
//         , method: 'GET'
//         , xhrFields: {
//             withCredentials: true
//         }
//         , success: function (data, textStatus, jqXHR) {
//             if (data && data.tokenId) {
//                 if (callback) {
//                     callback(data.tokenId);
//                 }
//             }
//         }
//     });
// };