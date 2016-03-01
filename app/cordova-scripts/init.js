import initPushNotifications from "./push-notifications";

if (ENVIRONMENT === "cordova") {
    document.addEventListener("deviceready", function () {
        initPushNotifications();
    });
}
