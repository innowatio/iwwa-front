import React from "react";
import {Route} from "react-router";
import {ReduxRouter} from "redux-router";

import * as views from "views";

module.exports = (
    <ReduxRouter>
        <Route component={views.Root} name="root">
            <Route component={views.Alarms} name="alarms" path="/alarms/" />
            <Route component={views.Alarms} name="alarm" path="/alarms/:id" />
            <Route component={views.Users} name="users" path="/users/" />
            <Route component={views.User} name="user" path="/users/:id" />
            <Route component={views.Chart} name="chart" path="/chart/" />
            <Route component={views.Dashboard} name="dashboard" path="/dashboard/" />
            <Route component={views.Dashboard} name="home" path="/" />
        </Route>
    </ReduxRouter>
);
