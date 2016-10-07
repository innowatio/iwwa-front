import {Map, List} from "immutable";
import R from "ramda";

export const ACCESS_MONITORING = "access-monitoring";
export const ACCESS_LUCY = "access-lucy";
export const ASSIGN_GROUPS = "assign-groups";
export const ASSIGN_SENSORS = "assign-sensors";
export const CREATE_GROUPS = "create-groups";
export const CREATE_SENSORS = "create-sensors";
export const DOWNLOAD_CHART_DATA = "download-chart-data";
export const EDIT_SENSORS = "edit-sensors";
export const MANAGE_USERS = "manage-users";
export const VIEW_FORMULA_DETAILS = "view-formula-details";

const usersAccess = [MANAGE_USERS, ASSIGN_GROUPS, CREATE_GROUPS, ASSIGN_SENSORS];

const ROLE_ADMIN = "admin";

export function getLoggedUser (asteroid) {
    const users = asteroid.collections.get("users") || Map();
    return users.get(asteroid.userId) || Map();
}

export function getGroups (asteroid) {
    return (getLoggedUser(asteroid).get("groups") || List()).toArray();
}

function getOldRoles (asteroid) {
    return (getLoggedUser(asteroid).get("roles") || List()).toArray();
}

export function getRoles (asteroid) {
    return getGroupsRoles(getGroups(asteroid), asteroid);
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

//TODO need to keep these until complete switch of roles management
export function isAdmin (asteroid) {
    return getOldRoles(asteroid).indexOf(ROLE_ADMIN) > -1;
}

export function hasRole (asteroid, role) {
    return getRoles(asteroid).indexOf(role) > -1;
}

export function isAuthorizedUser (asteroid) {
    const allRoles = R.values(R.map(role => role.name, (asteroid.collections.get("roles") || Map()).toJS()));
    //TODO need to keep these until complete switch of roles management
    const userRoles = getOldRoles(asteroid).concat(getRoles(asteroid));
    let isAuthorized = false;
    R.forEach(userRole => {
        isAuthorized = isAuthorized || R.contains(userRole, allRoles);
    }, userRoles);
    return isAuthorized;
}