import {combineReducers} from "redux";
import {reducer as form} from "redux-form";
import storage from "redux-storage";

import {collections} from "./collections";
import {chart} from "./chart";
import {consumptions} from "./consumptions";
import {alarms} from "./alarms";
import {monitoringChart} from "./monitoring-chart";
import {realTime} from "./real-time";
import {userSetting} from "./user-setting";
import {sensors} from "./sensors";
import {ssoAuth} from "./sso-auth";
import {notifications} from "./notifications";

const rootReducer = storage.reducer(combineReducers({
    collections,
    chart,
    consumptions,
    alarms,
    monitoringChart,
    realTime,
    userSetting,
    form,
    sensors,
    ssoAuth,
    notifications
}));

export default rootReducer;
