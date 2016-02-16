import {combineReducers} from "redux";
import storage from "redux-storage";

import {collections} from "./collections";
import {chart} from "./chart";
import {consumptions} from "./consumptions";
import {alarms} from "./alarms";
import {realTime} from "./real-time";
import {userSetting} from "./user-setting";

const rootReducer = storage.reducer(combineReducers({
    collections,
    chart,
    consumptions,
    alarms,
    realTime,
    userSetting
}));

export default rootReducer;
