import {Map, List} from "immutable";
import R from "ramda";

export const ACCESS_LUCY_LIGHT = "access-lucy-light";
export const ACCESS_LUCY_PRO = "access-lucy-pro";
export const ASSIGN_GROUPS = "assign-groups";
export const ASSIGN_SENSORS = "assign-sensors";
export const CREATE_GROUPS = "create-groups";
export const CREATE_SENSORS = "create-sensors";
export const DOWNLOAD_CHART_DATA = "download-chart-data";
export const EDIT_SENSORS = "edit-sensors";
export const MANAGE_USERS = "manage-users";
export const VIEW_ALL_ROLES = "view-all-roles";
export const VIEW_ALL_SENSORS = "view-all-sensors";
export const VIEW_ALL_SITES = "view-all-sites";
export const VIEW_ALL_USERS = "view-all-users";
export const VIEW_FORMULA_DETAILS = "view-formula-details";

const usersAccess = [MANAGE_USERS, ASSIGN_GROUPS, CREATE_GROUPS, ASSIGN_SENSORS];

export function getLoggedUser (asteroid) {
    const users = asteroid.collections.get("users") || Map();
    return users.get(asteroid.userId) || Map();
}

export function getGroups (asteroid) {
    return getUserGroups(getLoggedUser(asteroid));
}

function getUserGroups (user) {
    return (user.get("groups") || List()).toArray();
}

export function getRoles (asteroid) {
    return getGroupsRoles(getGroups(asteroid), asteroid);
}

export function getUserRoles (user, asteroid) {
    return getGroupsRoles(getUserGroups(user), asteroid);
}

export function getGroupsRoles (groups, asteroid) {
    return R.compose(
        R.filter(R.identity),
        R.uniq,
        R.flatten,
        R.map(function (groupName) {
            const group = (asteroid.collections.get("groups") || Map()).find(function (v) {
                return v.get("name") === groupName;
            });
            if (group && group.get("roles")) {
                return group.get("roles").toJS();
            }
        })
    )(groups);
}

export function canAccessUsers (asteroid) {
    let canAccess = false;
    const userRoles = getRoles(asteroid);
    usersAccess.forEach(role => {
        canAccess = canAccess || userRoles.indexOf(role) > -1;
    });
    return canAccess;
}

export function hasRole (asteroid, role) {
    return getRoles(asteroid).indexOf(role) > -1;
}

export function isAuthorizedUser (asteroid) {
    const allRoles = R.values(R.map(role => role.name, (asteroid.collections.get("roles") || Map()).toJS()));
    let isAuthorized = false;
    R.forEach(userRole => {
        isAuthorized = isAuthorized || R.contains(userRole, allRoles);
    }, getRoles(asteroid));
    return isAuthorized;
}
