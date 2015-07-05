var React = require("react/addons");

var asteroid = require("lib/asteroid");
var routes   = require("lib/routes");

React.render(routes, document.body);

// window.asteroid = asteroid;
// asteroid._ddp._socket.on("message:in", console.log.bind(console));
// asteroid._ddp._socket.on("message:out", console.log.bind(console));

window.React = React;
