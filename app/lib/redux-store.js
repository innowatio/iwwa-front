import createBrowserHistory from "history/lib/createBrowserHistory";
import createHashHistory from "history/lib/createHashHistory";
import {compose, createStore} from "redux";
import {reduxReactRouter} from "redux-router";

import rootReducer from "../reducers";

const createHistory = ENVIRONMENT === "cordova" ?
    createHashHistory :
    createBrowserHistory;

export default compose(
    reduxReactRouter({createHistory})
)(createStore)(rootReducer);
