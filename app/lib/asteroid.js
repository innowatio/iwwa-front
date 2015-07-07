var Asteroid = require("asteroid");

Asteroid.addPlugin(require("./asteroid-immutable-collections.js"));
Asteroid.addPlugin(require("./asteroid-react.js"));

var asteroid = new Asteroid({
    endpoint: "ws://localhost:3000/websocket"
});

window.asteroid = asteroid;

module.exports = asteroid;
