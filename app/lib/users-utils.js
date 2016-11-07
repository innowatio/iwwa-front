import Immutable from "immutable";
import R from "ramda";
import {getLoggedUser, getRoles, getUserRoles, hasRole, VIEW_ALL_ROLES, VIEW_ALL_SENSORS} from "lib/roles-utils";

export function getUsername (user) {
    const username = user.getIn(["services", "sso", "uid"]);
    return username ? username : user.get("_id");
}

export function isActiveUser (user) {
    return getProfileField(user, "active");
}

export function isConfirmedUser (user) {
    return getProfileField(user, "confirmed");
}

export function isDeleted (user) {
    return getProfileField(user, "isDeleted");
}

export function geUsersForManagement (allUsers) {
    return allUsers.filterNot(user => isDeleted(user) || hasParent(allUsers, user));
}

function hasParent (allUsers, user) {
    return allUsers.get(getParentUserId(user));
}

export function getParentUserId (user) {
    return getProfileField(user, "parentUserId");
}

export function getChildren (parentUserId, users) {
    return users.filter(user => getParentUserId(user) === parentUserId && !isDeleted(user));
}

function getProfileField (user, field) {
    return user.get("profile") ? user.getIn(["profile", field]) : null;
}

export function getVisibleRoles (rolesCollection, asteroid) {
    if (!rolesCollection) {
        return Immutable.Map();
    }
    if (hasRole(asteroid, VIEW_ALL_ROLES)) {
        return rolesCollection.sortBy(role => role.get("name"));
    } else {
        return getRoles(asteroid).sort();
    }
}

export function getVisibleGroups (groupsCollection, asteroid) {
    if (!groupsCollection) {
        return Immutable.Map();
    }
    if (hasRole(asteroid, VIEW_ALL_ROLES)) {
        return groupsCollection.sortBy(group => group.get("name"));
    } else {
        let groupsNames = [];
        const userRoles = getRoles(asteroid);
        groupsCollection.forEach(group => {
            if (R.difference(group.get("roles").toJS(), userRoles).length === 0) {
                groupsNames.push(group.get("name"));
            }
        });
        return groupsNames.sort();
    }
}

export function hasParentPermissions (childUser, parentUser, asteroid) {
    return (hasRole(asteroid, VIEW_ALL_ROLES) || arrayContainsArray(getUserRoles(parentUser, asteroid), getUserRoles(childUser, asteroid))) &&
        (hasRole(asteroid, VIEW_ALL_SENSORS) || arrayContainsArray(parentUser.get("sensors"), childUser.get("sensors")));
}

function arrayContainsArray (masterArray, checkingArray) {
    if (!checkingArray) {
        return true;
    }
    return checkingArray.every(elem => masterArray && masterArray.indexOf(elem) >= 0);
}

export function isLoggedUser (asteroid, user) {
    return getLoggedUser(asteroid).get("_id") == user.get("_id");
}