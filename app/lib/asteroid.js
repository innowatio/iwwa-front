var Asteroid = require("asteroid");

Asteroid.addPlugin(require("./asteroid-immutable-collections.js"));
Asteroid.addPlugin(require("./asteroid-react.js"));

var asteroid = new Asteroid({
    endpoint: "ws://" + BACKEND_HOST + "/websocket"
});

window.asteroid = asteroid;

module.exports = asteroid;
