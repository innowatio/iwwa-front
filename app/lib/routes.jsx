import React from "react";
import {Router, Route, hashHistory, browserHistory} from "react-router";


import * as views from "views";

const history = (ENVIRONMENT === "cordova" ? hashHistory : browserHistory);

module.exports = (
    <Router history={history}>
        <Route component={views.Root} name="root">
            <Route component={views.Alarms} name="alarms" path="/alarms/" titleView="Allarmi" />
            <Route component={views.Alarms} name="alarm" path="/alarms/:id" titleView="Allarmi" />
            <Route component={views.Dashboard} name="dashboard" path="/dashboard/" titleView="Dashboard"/>
            <Route component={views.Users} name="users" path="/users/" titleView="Amministrazione utenti"/>
            <Route component={views.User} name="user" path="/users/:id" />
            <Route component={views.Chart} name="chart" path="/chart/" titleView="Storico consumi" />
            <Route component={views.SummaryConsumptions} name="consumptions" path="/consumptions/" titleView="Riepilogo Consumi" />
            <Route component={views.RealTime} name="live" path="/live/" titleView="Consumi live" />
            <Route component={views.Dashboard} name="home" path="/" />
            <Route component={views.Monitoring} name="monitoring" path="/monitoring/" titleView="Monitoring" />
            <Route component={views.MonitoringChartView} name="monitoring-chart" path="/monitoring/chart/" titleView="Monitoring chart" />
        </Route>
    </Router>
);
