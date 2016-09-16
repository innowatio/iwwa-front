import {Map, List} from "immutable";
import R from "ramda";

const ROLE_ADMIN = "admin";
const ROLE_YOUSAVE = "yousave";

export function getLoggedUser (asteroid) {
    const users = asteroid.collections.get("users") || Map();
    return users.get(asteroid.userId) || Map();
}

export function getGroups (asteroid) {
    return (getLoggedUser(asteroid).get("groups") || List()).toArray();
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
            const group = asteroid.collections.get("groups").find(function (v) {
                return v.get("name") === groupName;
            });
            if (group && group.get("roles")) {
                return group.get("roles").toJS();
            }
        })
    )(groups);
}

//TODO need to keep these until complete switch of roles management
export function isAdmin (asteroid) {
    return getGroups(asteroid).indexOf(ROLE_ADMIN) > -1;
}

export function isYousaveUser (asteroid) {
    return getGroups(asteroid).indexOf(ROLE_YOUSAVE) > -1;
}

export function isAuthorizedUser (asteroid) {
    const allRoles = R.values(R.map(role => role.name, (asteroid.collections.get("roles") || Map()).toJS()));
    const userRoles = getRoles(asteroid);
    let isAuthorized = false;
    R.forEach(userRole => {
        isAuthorized = isAuthorized || R.contains(userRole, allRoles);
    }, userRoles);
    return isAuthorized;
}