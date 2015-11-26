import {combineReducers} from "redux";
import {routerStateReducer as router} from "redux-router";

import {collections} from "reducers/collections";
import {chart} from "reducers/chart";

const rootReducer = combineReducers({
    router,
    collections,
    chart
});

export default rootReducer;
