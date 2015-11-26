import createBrowserHistory from "history/lib/createBrowserHistory";
import createHashHistory from "history/lib/createHashHistory";
import {compose, createStore, applyMiddleware} from "redux";
import {reduxReactRouter} from "redux-router";
import thunk from "redux-thunk";

import rootReducer from "../reducers";

const createHistory = ENVIRONMENT === "cordova" ?
    createHashHistory :
    createBrowserHistory;

export default compose(
    applyMiddleware(
        thunk
    ),
    reduxReactRouter({createHistory})
)(createStore)(rootReducer);
