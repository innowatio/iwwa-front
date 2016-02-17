import {compose, createStore, applyMiddleware} from "redux";
import createLogger from "redux-logger";
import thunk from "redux-thunk";
import createEngine from "redux-storage-engine-localstorage";
import filter from "redux-storage-decorator-filter";
import storage from "redux-storage";

import rootReducer from "../reducers";

const logger = createLogger({
    collapsed: true
});

const storageEngine = filter(createEngine("iwwaApp"), [
    "chart",
    "consumptions",
    "realTime",
    "userSetting"
]);
const storageMiddleware = storage.createMiddleware(storageEngine);

const store = compose(
    applyMiddleware(
        thunk,
        storageMiddleware,
        logger
    )
)(createStore)(rootReducer);

export const load = storage.createLoader(storageEngine);
load(store);

export default store;
