import createBrowserHistory from "history/lib/createBrowserHistory";
import createHashHistory from "history/lib/createHashHistory";
import {compose, createStore, applyMiddleware} from "redux";
import createLogger from "redux-logger";
import {reduxReactRouter} from "redux-router";
import thunk from "redux-thunk";
import createEngine from "redux-storage/engines/localStorage";

import storage from "redux-storage";

import rootReducer from "../reducers";

const createHistory = (
    ENVIRONMENT === "cordova" ?
    createHashHistory :
    createBrowserHistory
);
const logger = createLogger({
    collapsed: true
});

const storageEngine = storage.decorators.filter(createEngine("iwwaApp"), [
    "chart",
    "consumptions",
    "realTime",
    "userSetting"
]);
const storageMiddleware = storage.createMiddleware(storageEngine);

const store = compose(
    reduxReactRouter({createHistory}),
    applyMiddleware(
        thunk,
        storageMiddleware,
        logger
    )
)(createStore)(rootReducer);

export const load = storage.createLoader(storageEngine);
load(store);

export default store;
