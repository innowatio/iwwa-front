import React from "react";
import {Router, Route, hashHistory, browserHistory} from "react-router";

import asteroid from "lib/asteroid";
import {EXEC_ENV} from "lib/config";
import {canAccessUsers, hasRole, ACCESS_LUCY_PRO} from "lib/roles-utils";

import * as views from "views";

const history = (EXEC_ENV === "cordova" ? hashHistory : browserHistory);

module.exports = (
    <Router history={history}>
        <Route component={views.Root} name="root">
            <Route component={views.MultiSite} name="home" path="/" titleView="Dashboard Multisite" />
            <Route component={views.Alarms} name="alarms" path="/alarms/" titleView="Allarmi" />
            <Route component={views.Alarms} name="alarm" path="/alarms/:id" titleView="Allarmi" />
            <Route component={views.Users} name="users" path="/users/" titleView="Amministrazione utenti"
                onEnter={requireAdminAuthorization}
            />
            <Route component={views.User} name="user" path="/users/:id" onEnter={requireAdminAuthorization} />
            <Route component={views.Chart} name="chart" path="/chart/" titleView="Storico consumi" />
            <Route component={views.SummaryConsumptions} name="consumptions" path="/consumptions/" titleView="Riepilogo Consumi" />
            <Route component={views.RealTime} name="live" path="/live/" titleView="Consumi live" />
            <Route component={views.MultiSite} name="dashboard" path="/multisite/" titleView="Dashboard Multisite" />
            <Route component={views.Monitoring} name="monitoring" path="/monitoring/" titleView="Monitoring"
                onEnter={requireYousaveAuthorization}
            />
            <Route component={views.MonitoringChartView} name="monitoring-chart" path="/monitoring/chart/" titleView="Monitoring chart"
                onEnter={requireYousaveAuthorization}
            />
            <Route component={views.MonitoringFavoritesCharts} name="monitoring-favorites-charts" path="/monitoring/favorites/" titleView="Favorites charts"
                onEnter={requireYousaveAuthorization}
            />
        </Route>
    </Router>
);

function requireAdminAuthorization (nextState, replace) {
    if (!canAccessUsers(asteroid)) {
        applyReplace(nextState, replace, "/");
    }
}

function requireYousaveAuthorization (nextState, replace) {
    if (!hasRole(asteroid, ACCESS_LUCY_PRO)) {
        applyReplace(nextState, replace, "/");
    }
}

function applyReplace (nextState, replace, path) {
    replace({
        pathname: path,
        state: {nextPathname: nextState.location.pathname}
    });
}
