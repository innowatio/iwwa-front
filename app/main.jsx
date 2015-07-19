var R     = require("ramda");
var React = require("react/addons");

var routes = require("lib/routes");
React.render(routes, document.body);

window.R = R;
window.React = React;
