import axios from "axios";

export const setTokenOnInnowatioSSO = (tokenId) => {
    const endpoint = "https://sso.innowatio.it/tokenId";
    axios.post(endpoint, {
        tokenId: tokenId
    }, {
        withCredentials: true
    })
        .then(() => console.log("success"))
        .catch(() => console.log("error"));
};