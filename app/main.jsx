import R from "ramda";
import React from "react";
import {render} from "react-dom";
import FastClick from "fastclick";
import {Provider} from "react-redux";
import Immutable from "immutable";

import asteroid from "lib/asteroid";
import {syncStoreAndAsteroid} from "lib/asteroid-redux";
import store from "lib/redux-store";
import routes from "lib/routes";

FastClick.attach(document.body);

window.R = R;
window.React = React;
window.Immutable = Immutable;

syncStoreAndAsteroid(store, asteroid);

const App = (
    <Provider store={store}>
        {routes}
    </Provider>
);

window.store = store;

render(App, document.getElementById("root"));

