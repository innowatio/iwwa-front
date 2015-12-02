import R from "ramda";
import React from "react";
import {render} from "react-dom";
import FastClick from "fastclick";
import {Provider} from "react-redux";

import asteroid from "lib/asteroid";
import {syncStoreAndAsteroid} from "lib/asteroid-redux";
import store from "lib/redux-store";
import routes from "lib/routes";
import {load} from "lib/redux-store";

FastClick.attach(document.body);
load(store);
syncStoreAndAsteroid(store, asteroid);

const App = (
    <Provider store={store}>
        {routes}
    </Provider>
);

window.store = store;

render(App, document.getElementById("root"));

window.R = R;
window.React = React;
