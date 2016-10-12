import axios from "axios";
import R from "ramda";

import {WRITE_API_ENDPOINT} from "lib/config";
import {getChildren, getUsername, isActiveUser} from "lib/users-utils";

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
            profile: {
                ...user.get("profile").toObject(),
                active: !isActiveUser(user)
            }
        };
        updateUser(dispatch, user, newProfile, "ACTIVE_STATUS_UPDATE");
    };
};

function updateUser (dispatch, user, updatedInfo, event) {
    const userName = getUsername(user);
    const endpoint = "http://" + WRITE_API_ENDPOINT + "/users/";
    const updatedUser = {
        uid: userName,
        ...updatedInfo
    };
    axios.post(endpoint, updatedUser)
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
        checkAndAssignObjectsToUsers(dispatch, users, sensors, assignSensorsToUser, "sensors");
    };
};

function checkAndAssignObjectsToUsers (dispatch, users, objects, assignFunc, userField) {
    if (users.length == 1) {
        assignFunc(dispatch, users[0], objects);
    } else {
        users.forEach(user => {
            const merged = user.get(userField) ? R.compose(R.uniq, R.flatten)([user.get(userField).toJS(), objects]) : objects;
            assignFunc(dispatch, user, merged);
        });
    }
}

function assignSensorsToUser (dispatch, user, sensors) {
    const updated = {
        sensors: sensors
    };
    updateUser(dispatch, user, updated, "SENSORS_ASSIGNMENT");
}

function assignGroupsToUser (dispatch, user, groups) {
    const updated = {
        groups: groups
    };
    updateUser(dispatch, user, updated, "GROUPS_ASSIGNMENT");
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
    return dispatch => {
        dispatch({
            type: "ASSIGNING_GROUPS_TO_USERS"
        });
        checkAndAssignObjectsToUsers(dispatch, users, groups, assignGroupsToUser, "groups");
    };
};

export const saveAndAssignGroupToUsers = (users, groupName, roles) => {
    return dispatch => {
        dispatch({
            type: "ASSIGNING_GROUPS_TO_USERS"
        });
        var endpoint = "http://" + WRITE_API_ENDPOINT + "/groups";
        const group = {
            name: groupName,
            roles: roles
        };
        axios.post(endpoint, group)
            .then(() => dispatch({
                type: "GROUP_CREATION_SUCCESS"
            }))
            .catch(() => dispatch({
                type: "GROUP_CREATION_FAIL"
            }));
        checkAndAssignObjectsToUsers(dispatch, users, [groupName], assignGroupsToUser, "groups");
    };
};

export const moveUser = (user, parentUserId) => {
    return dispatch => {
        dispatch({
            type: "MOVING_USER"
        });
        const newProfile = {
            profile: {
                ...user.get("profile").toObject(),
                parentUserId: parentUserId
            }
        };
        updateUser(dispatch, user, newProfile, "CHANGE_USER_PARENT");
    };
};
