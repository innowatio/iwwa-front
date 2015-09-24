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
        console.log("REGISTERED");
        console.log(data.registrationId);
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
