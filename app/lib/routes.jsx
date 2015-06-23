var React = require("react");
var Router = require("react-router");

var views = require("views");

module.exports = (
    <Router.Route name="root" path="/" handler={views.Root}>
        <Router.Route name="login" path="login/" handler={views.Login} />
        <Router.DefaultRoute handler={views.Login} />
    </Router.Route>
);
