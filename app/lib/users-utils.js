export function getUsername (user) {
    const username = user.getIn(["services", "sso", "uid"]);
    return username ? username : user.get("_id");
}

export function isConfirmedUser (user) {
    return user.get("profile") ? user.getIn(["profile", "confirmed"]) : false;
}