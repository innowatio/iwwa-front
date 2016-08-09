import {Map, List} from "immutable";
import R from "ramda";

const ROLE_ADMIN = "admin";
const ROLE_YOUSAVE = "yousave";

export function getRoles (asteroid) {
    const users = asteroid.collections.get("users") || Map();
    return (users.getIn([asteroid.userId, "roles"]) || List()).toArray();
}

export function isAdmin (asteroid) {
    return getRoles(asteroid).indexOf(ROLE_ADMIN) > -1;
}

export function isYousaveUser (asteroid) {
    return getRoles(asteroid).indexOf(ROLE_YOUSAVE) > -1;
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