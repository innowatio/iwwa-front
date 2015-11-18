var R         = require("ramda");
var React     = require("react");
var ReactDOM  = require("react-dom");
var FastClick = require("fastclick");

FastClick.attach(document.body);

var routes = require("lib/routes");
ReactDOM.render(routes, document.getElementById("root"));

window.R = R;
window.React = React;
