var React          = require("react");
var Router         = require("react-router");
var BrowserHistory = require("react-router/lib/BrowserHistory");
var HashHistory    = require("react-router/lib/HashHistory");

var views = require("views");

var checkLocalStorageAndRedirect = function (nextState, replaceState) {
    if (!nextState.location.query && localStorage.query) {
        nextState.location.query = JSON.parse(localStorage.query);
    }
    return replaceState;
};

module.exports = (
    <Router.Router history={ENVIRONMENT === "cordova" ? HashHistory.history : BrowserHistory.history}>
        <Router.Route component={views.Root} name="root">
            <Router.Route component={views.Alarms} name="alarms" path="/alarms/" />
            <Router.Route component={views.Alarms} name="alarm" path="/alarms/:id" />
            <Router.Route component={views.Chart} name="chart" onEnter={checkLocalStorageAndRedirect} path="/chart/" />
            <Router.Route component={views.Dashboard} name="dashboard" path="/dashboard/" />
            <Router.Route component={views.Dashboard} name="home" path="/" />
        </Router.Route>
    </Router.Router>
);
