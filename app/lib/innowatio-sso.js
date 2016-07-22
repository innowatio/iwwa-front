import axios from "axios";

export const setTokenOnInnowatioSSO = (tokenId) => {
    const endpoint = "https://sso.innowatio.it/tokenId";
    axios.post(endpoint, {
        data: {
            tokenId: tokenId
        },
        withCredentials: true
    })
        .catch(() => console.error("Error setting token on Innowatio SSO"));
};

export const getTokenFromInnowatioSSO = (callback) => {
    const endpoint = "https://sso.innowatio.it/tokenId";
    axios.get(endpoint, {
        withCredentials: true
    })
        .then((result) => {
            if (result.data && result.data.tokenId) {
                callback(result.data.tokenId);
            }
        })
        .catch(() => console.error("Error retrieving token from Innowatio SSO"));
};