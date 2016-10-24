import axios from "axios";
import R from "ramda";

import {WRITE_API_ENDPOINT} from "lib/config";
import {getChildren, getUsername, isActiveUser} from "lib/users-utils";

import {getBasicObject} from "./utils";

export const ACTIVE_STATUS_UPDATE_SUCCESS = "ACTIVE_STATUS_UPDATE_SUCCESS";
export const ADD_ROLE = "ADD_ROLE";
export const CHANGE_USER_PARENT_SUCCESS = "CHANGE_USER_PARENT_SUCCESS";
export const GROUPS_ASSIGNMENT_SUCCESS = "GROUPS_ASSIGNMENT_SUCCESS";
export const REMOVE_ROLE = "REMOVE_ROLE";
export const RESET_ROLES_GROUPS = "RESET_ROLES_GROUPS";
export const SELECT_USER = "SELECT_USER";
export const SELECT_USER_TO_CLONE = "SELECT_USER_TO_CLONE";
export const SENSORS_ASSIGNMENT_SUCCESS = "SENSORS_ASSIGNMENT_SUCCESS";
export const TOGGLE_CLONE = "TOGGLE_CLONE";
export const TOGGLE_GROUP = "TOGGLE_GROUP";
export const USER_DELETE_SUCCESS = "USER_DELETE_SUCCESS";

export const selectUser = user => getBasicObject(SELECT_USER, user);

export const selectUserToClone = user => getBasicObject(SELECT_USER_TO_CLONE, user);

export const toggleClone = () => getBasicObject(TOGGLE_CLONE);

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
            type: event + "_SUCCESS",
            payload: {
                _id: user.get("_id"),
                ...updatedUser
            }
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
    const newProfile = {
        profile: {
            ...user.get("profile").toObject(),
            isDeleted: true
        }
    };
    updateUser(dispatch, user, newProfile, "USER_DELETE");
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

export const cloneUsers = (userToClone, usersToBeCloned) => {
    return dispatch => {
        dispatch({
            type: "CLONING_USERS"
        });
        usersToBeCloned.forEach(user => {
            const newSettings = {
                groups: userToClone.get("groups"),
                sensors: userToClone.get("sensors")
            };
            updateUser(dispatch, user, newSettings, "CLONE_USER");
        });
    };
};
