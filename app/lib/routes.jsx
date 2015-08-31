var React          = require("react");
var Router         = require("react-router");
var BrowserHistory = require("react-router/lib/BrowserHistory");

var views = require("views");

module.exports = (
    <Router.Router history={BrowserHistory.history}>
        <Router.Route component={views.Root} name="root" path="/">
            <Router.Route component={views.Alarms} name="alarms" path="alarms/" />
            <Router.Route component={views.Alarms} name="alarms" path="alarms/:id" />
            <Router.Route component={views.Chart} name="chart" path="chart/" />
            <Router.Route component={views.Dashboard} name="dashboard" path="dashboard/" />
        </Router.Route>
    </Router.Router>
);
