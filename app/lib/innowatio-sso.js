import axios from "axios";

export const setTokenOnInnowatioSSO = (tokenId) => {
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