var initPushNotifications = require("./push-notifications");

if (ENVIRONMENT === "cordova") {
    document.addEventListener("deviceready", function () {
        initPushNotifications();
    });
}
