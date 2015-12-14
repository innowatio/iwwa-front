import {combineReducers} from "redux";
import {routerStateReducer as router} from "redux-router";
import storage from "redux-storage";

import {collections} from "reducers/collections";
import {chart} from "reducers/chart";

const rootReducer = storage.reducer(combineReducers({
    router,
    collections,
    chart
}));

export default rootReducer;
