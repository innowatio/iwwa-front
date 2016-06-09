import {EXEC_ENV} from "./config";

module.exports = function assetsPathTo (target) {
    var prefix = (EXEC_ENV === "cordova" ? "" : "/");
    return prefix + "_assets/" + target;
};
