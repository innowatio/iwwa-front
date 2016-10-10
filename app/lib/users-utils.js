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