import {combineReducers} from "redux";
import {routerStateReducer as router} from "redux-router";

import {collections} from "reducers/collections";

const rootReducer = combineReducers({
    router,
    collections
});

export default rootReducer;
