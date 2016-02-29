import asteroid from "lib/asteroid";
import store from "lib/redux-store";

import {showNotificationModal} from "actions/notifications";

function saveRegistrationId (registrationId) {
    asteroid.call("saveRegistrationId", registrationId, device);
}

export default function initPushNotifications () {
    const options = {
        ios: {
            alert: "true",
            badge: "true",
            sound: "true",
            vibration: "true",
            foreground: "true",
            clearBadge: "true",
            categories: {
                invite: {
                    yes: {
                        callback: "app.accept", "title": "Si", "foreground": true, "destructive": false
                    },
                    no: {
                        callback: "app.reject", "title": "No", "foreground": true, "destructive": false
                    }
                },
                delete: {
                    yes: {
                        callback: "app.doDelete", "title": "Cancella", "foreground": true, "destructive": true
                    },
                    no: {
                        callback: "app.cancel", "title": "Cancella", "foreground": true, "destructive": false
                    }
                }
            }
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
        store.dispatch(showNotificationModal(data));
        // call finish to let the OS know we are done
        push.finish(() => {
            console.log("processing of push data is finished");
        });
    });
    push.on("error", function (e) {
        console.log("ERROR");
        console.log(e);
    });
}
