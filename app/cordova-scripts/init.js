import initPushNotifications from "./push-notifications";

import {EXEC_ENV} from "lib/config";

if (EXEC_ENV === "cordova") {
    document.addEventListener("deviceready", function () {
        initPushNotifications();
    });
}
