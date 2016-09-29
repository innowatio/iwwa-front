import axios from "axios";
import R from "ramda";

import {WRITE_API_ENDPOINT} from "lib/config";
import {getChildren, isActiveUser} from "lib/users-utils";

import {getBasicObject} from "./utils";

export const ADD_ROLE = "ADD_ROLE";
export const REMOVE_ROLE = "REMOVE_ROLE";
export const RESET_ROLES_GROUPS = "RESET_ROLES_GROUPS";
export const SELECT_USER = "SELECT_USER";
export const TOGGLE_GROUP = "TOGGLE_GROUP";
export const USER_DELETE_SUCCESS = "USER_DELETE_SUCCESS";

export const selectUser = user => getBasicObject(SELECT_USER, user);

export const changeActiveStatus = user => {
    return dispatch => {
        dispatch({
            type: "CHANGING_ACTIVE_STATUS"
        });
        const newProfile = {
            ...user.get("profile"),
            active: !isActiveUser(user)
        };
        updateUser(dispatch, user.get("_id"), newProfile, "ACTIVE_STATUS_UPDATE");
    };
};

function updateUser (dispatch, userId, updatedInfo, event) {
    const endpoint = "http://" + WRITE_API_ENDPOINT + "/users/" + userId;
    axios.put(endpoint, updatedInfo)
        .then(() => dispatch({
            type: event + "_SUCCESS"
        }))
        .catch(() => dispatch({
            type: event + "_FAIL"
        }));
}

export const assignSensorsToUsers = (users, sensors) => {
    return dispatch => {
        dispatch({
            type: "ASSIGNING_SENSORS_TO_USERS"
        });
        if (users.length == 1) {
            assignSensorsToUser(dispatch, users[0], sensors);
        } else {
            users.forEach(user => {
                const mergedSensors = user.get("sensors") ? R.compose(R.uniq, R.flatten)([user.get("sensors").toJS(), sensors]) : sensors;
                assignSensorsToUser(dispatch, user, mergedSensors);
            });
        }
    };
};

function assignSensorsToUser (dispatch, user, sensors) {
    const updated = {
        sensors: sensors
    };
    updateUser(dispatch, user.get("_id"), updated, "SENSORS_ASSIGNMENT");
}

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

export const toggleGroup = group => getBasicObject(TOGGLE_GROUP, group);

export const addRole = role => getBasicObject(ADD_ROLE, role);

export const removeRole = role => getBasicObject(REMOVE_ROLE, role);

export const resetRolesAndGroups = () => getBasicObject(RESET_ROLES_GROUPS);

export const assignGroupsToUsers = (users, groups) => {
    console.log(users);
    console.log(groups);
    return dispatch => {
        dispatch({
            type: "ASSIGNING_GROUPS_TO_USERS"
        });
        //TODO
        // if (users.length == 1) {
        //     assignSensorsToUser(dispatch, users[0], sensors);
        // } else {
        //     users.forEach(user => {
        //         const mergedSensors = user.get("sensors") ? R.compose(R.uniq, R.flatten)([user.get("sensors").toJS(), sensors]) : sensors;
        //         assignSensorsToUser(dispatch, user, mergedSensors);
        //     });
        // }
    };
};

export const saveAndAssignGroupToUsers = (users, groupName, roles) => {
    console.log(users);
    console.log(groupName);
    console.log(roles);
    return dispatch => {
        //TODO
        dispatch({
            type: "ASSIGNING_GROUPS_TO_USERS"
        });
        // if (users.length == 1) {
        //     assignSensorsToUser(dispatch, users[0], sensors);
        // } else {
        //     users.forEach(user => {
        //         const mergedSensors = user.get("sensors") ? R.compose(R.uniq, R.flatten)([user.get("sensors").toJS(), sensors]) : sensors;
        //         assignSensorsToUser(dispatch, user, mergedSensors);
        //     });
        // }
    };
};