var React  = require("react");
var Router = require("react-router");

var views = require("views");

module.exports = (
    <Router.Route handler={views.Root} name="root" path="/">
        <Router.Route handler={views.Login} name="login" path="login/" />
        <Router.DefaultRoute handler={views.Login} />
    </Router.Route>
);
