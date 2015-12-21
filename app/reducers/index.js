import {combineReducers} from "redux";
import {routerStateReducer as router} from "redux-router";
import storage from "redux-storage";

import {collections} from "reducers/collections";
import {chart} from "reducers/chart";
import {alarms} from "reducers/alarms";
import {realTime} from "reducers/real-time";

const rootReducer = storage.reducer(combineReducers({
    router,
    collections,
    chart,
    alarms,
    realTime
}));

export default rootReducer;
