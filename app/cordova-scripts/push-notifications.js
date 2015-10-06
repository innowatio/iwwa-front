var asteroid = require("lib/asteroid.js");

var saveRegistrationId = function (registrationId) {
    asteroid.call("saveRegistrationId", registrationId);
};

module.exports = function initPushNotifications () {
    var options = {
       ios: {
           alert: "true",
           badge: "true",
           sound: "true"
        }
    };
    var push = PushNotification.init(options);
    push.on("registration", function (data) {
        if (asteroid.loggedIn) {
            saveRegistrationId(data.registrationId);
        } else {
            asteroid.on("loggedIn", function () {
                saveRegistrationId(data.registrationId);
            });
        }
    });
    push.on("notification", function (data) {
        console.log("NOTIFICATION");
        console.log(data);
    });
    push.on("error", function (e) {
        console.log("ERROR");
        console.log(e);
    });
};
