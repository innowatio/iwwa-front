import {Map, List} from "immutable";
import {contains} from "ramda";

const ROLE_ADMIN = "admin";
const ROLE_YOUSAVE = "yousave";

export function getRoles (asteroid) {
    const users = asteroid.collections.get("users") || Map();
    return (users.getIn([asteroid.userId, "roles"]) || List()).toArray();
}

export function isAdmin (asteroid) {
    return contains(getRoles(asteroid), ROLE_ADMIN);
}

export function isYousaveUser (asteroid) {
    return contains(getRoles(asteroid), ROLE_YOUSAVE);
}
