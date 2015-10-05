var React          = require("react");
var Router         = require("react-router");
var BrowserHistory = require("react-router/lib/BrowserHistory");
var HashHistory    = require("react-router/lib/HashHistory");

var views = require("views");

module.exports = (
    <Router.Router history={ENVIRONMENT === "cordova" ? HashHistory.history : BrowserHistory.history}>
        <Router.Route component={views.Root} name="root">
            <Router.Route component={views.Alarms} name="alarms" path="/alarms/" />
            <Router.Route component={views.Alarms} name="alarm" path="/alarms/:id" />
            <Router.Route component={views.Chart} name="chart" path="/chart/" />
            <Router.Route component={views.Users} name="users" path="/users/" />
            <Router.Route component={views.User} name="user" path="/users/:id" />
            <Router.Route component={views.Dashboard} name="dashboard" path="/dashboard/" />
            <Router.Route component={views.Dashboard} name="home" path="/" />
        </Router.Route>
    </Router.Router>
);
