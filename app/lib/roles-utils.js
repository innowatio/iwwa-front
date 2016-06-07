import {Map, List} from "immutable";

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
