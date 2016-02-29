import asteroid from "lib/asteroid";

function saveRegistrationId (registrationId) {
    asteroid.call("saveRegistrationId", registrationId);
}

export default function initPushNotifications () {
    const options = {
        ios: {
            alert: "true",
            badge: "true",
            sound: "true"
        }
    };
    const push = PushNotification.init(options);
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
}
