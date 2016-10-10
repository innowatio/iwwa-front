import {combineReducers} from "redux";
import {reducer as form} from "redux-form";

import {alarms} from "./alarms";
import {chart} from "./chart";
import {collections} from "./collections";
import {consumptions} from "./consumptions";
import {monitoringChart} from "./monitoring-chart";
import {notifications} from "./notifications";
import {realTime} from "./real-time";
import {sensors} from "./sensors";
import {userSetting} from "./user-setting";
import {users} from "./users";

const rootReducer = combineReducers({
    alarms,
    chart,
    collections,
    consumptions,
    monitoringChart,
    notifications,
    realTime,
    sensors,
    userSetting,
    users,
    form
});

export default rootReducer;
