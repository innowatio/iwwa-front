import {Router, Route} from "react-router";
import BrowserHistory from "history/lib/createBrowserHistory";
import HashHistory from "history/lib/createHashHistory";
var React = require("react");

var views = require("views");

var checkLocalStorageAndRedirect = function (nextState, replaceState) {
    if (!nextState.location.query && localStorage.query) {
        nextState.location.query = JSON.parse(localStorage.query);
    }
    return replaceState;
};

module.exports = (
    <Router history={ENVIRONMENT === "cordova" ? HashHistory() : BrowserHistory()}>
        <Route component={views.Root} name="root">
            <Route component={views.Alarms} name="alarms" path="/alarms/" />
            <Route component={views.Alarms} name="alarm" path="/alarms/:id" />
            <Route component={views.Users} name="users" path="/users/" />
            <Route component={views.User} name="user" path="/users/:id" />
            <Route component={views.Chart} name="chart" onEnter={checkLocalStorageAndRedirect} path="/chart/" />
            <Route component={views.Dashboard} name="dashboard" path="/dashboard/" />
            <Route component={views.RealTime} name="live" path="/live/" />
            <Route component={views.Dashboard} name="home" path="/" />
        </Route>
    </Router>
);
