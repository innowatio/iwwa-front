import {compose, createStore, applyMiddleware} from "redux";
import createLogger from "redux-logger";
import thunk from "redux-thunk";
import {persistStore, autoRehydrate} from "redux-persist";

import rootReducer from "../reducers";

const logger = createLogger({
    collapsed: true
});

const storageConfig ={
    whitelist: [
        "chart",
        "consumptions",
        "realTime",
        "userSetting"
    ]
};

const store = compose(
    applyMiddleware(
        thunk,
        logger
    )
)(createStore)(rootReducer, undefined, autoRehydrate());

persistStore(store, storageConfig);

export default store;
