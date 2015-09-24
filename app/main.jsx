var R     = require("ramda");
var React = require("react/addons");
var FastClick = require("fastclick");

FastClick.attach(document.body);

var routes = require("lib/routes");
React.render(routes, document.body);

// Init cordova-specific behaviours
require("cordova-scripts/init");

window.R = R;
window.React = React;
