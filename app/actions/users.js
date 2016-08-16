import axios from "axios";

import {WRITE_API_ENDPOINT} from "lib/config";
import {getChildren, isActiveUser} from "lib/users-utils";

import {getBasicObject} from "./utils";

export const SELECT_USER = "SELECT_USER";
export const USER_DELETE_SUCCESS = "USER_DELETE_SUCCESS";

export const selectUser = user => getBasicObject(SELECT_USER, user);

export const changeActiveStatus = user => {
    return dispatch => {
        dispatch({
            type: "CHANGING_ACTIVE_STATUS"
        });
        const endpoint = "http://" + WRITE_API_ENDPOINT + "/users/" + user.get("_id");
        const newProfile = {
            ...user.get("profile"),
            active: !isActiveUser(user)
        };
        axios.put(endpoint, newProfile)
            .then(() => dispatch({
                type: "ACTIVE_STATUS_UPDATE_SUCCESS"
            }))
            .catch(() => dispatch({
                type: "ACTIVE_STATUS_UPDATE_FAIL"
            }));
    };
};

export const deleteUsers = (usersToDelete, allUsers) => {
    return dispatch => {
        dispatch({
            type: "DELETING_USERS"
        });
        usersToDelete.forEach(user => deleteUser(user, allUsers, dispatch));
    };
};

function deleteUser (user, allUsers, dispatch) {
    const userId = user.get("_id");
    const endpoint = "http://" + WRITE_API_ENDPOINT + "/users/" + userId;
    axios.delete(endpoint)
        .then(() => dispatch({
            type: USER_DELETE_SUCCESS,
            payload: userId
        }))
        .catch(() => dispatch({
            type: "USER_DELETE_FAIL"
        }));
    getChildren(userId, allUsers).forEach(child => deleteUser(child, allUsers, dispatch));

}