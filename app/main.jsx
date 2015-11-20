import R from "ramda";
import React from "react";
import {render} from "react-dom";
import FastClick from "fastclick";
import {Provider} from "react-redux";

import store from "lib/redux-store";
import routes from "lib/routes";

FastClick.attach(document.body);


const App = (
    <Provider store={store}>
        {routes}
    </Provider>
);

render(App, document.getElementById("root"));

window.R = R;
window.React = React;
