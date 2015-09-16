module.exports = function assetsPathTo (target) {
    var prefix = (ENVIRONMENT === "cordova" ? "" : "/");
    return prefix + "_assets/" + target;
};
