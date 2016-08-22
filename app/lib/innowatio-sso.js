import axios from "axios";

export const setTokenOnInnowatioSSO = (tokenId, callback) => {
    const endpoint = "https://sso.innowatio.it/tokenId";
    axios.post(endpoint, `tokenId=${tokenId}`, {
        withCredentials: true
    }).then(() => {
        if (callback) {
            callback();
        }
    }).catch(error => console.error("Error setting token on Innowatio SSO: " + error));
};

export const getTokenFromInnowatioSSO = (callback) => {
    const endpoint = "https://sso.innowatio.it/tokenId";
    axios.get(endpoint, {
        withCredentials: true
    }).then(result => {
        if (result.data && result.data.tokenId) {
            callback(result.data.tokenId);
        }
    }).catch(error => console.error("Error retrieving token from Innowatio SSO: " + error));
};