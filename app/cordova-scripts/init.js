var initPushNotifications = require("./push-notifications");
var hideStatusBar = require("./statusbar.js");

if (ENVIRONMENT === "cordova") {
    document.addEventListener("deviceready", function () {
        initPushNotifications();
        hideStatusBar();
    });
}
