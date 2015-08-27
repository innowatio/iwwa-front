var Asteroid = require("asteroid")
    .mixin(require("./asteroid-immutable-collections.js"))
    .mixin(require("./asteroid-react.js"));

var asteroid = new Asteroid({
    endpoint: "ws://" + READ_BACKEND_HOST + "/websocket"
});


// Decommment for debugging
// window.asteroid = asteroid;
// asteroid.ddp.socket.on("message:in", (msg) => {
//     console.log("Message IN");
//     console.log(msg);
// });
// asteroid.ddp.socket.on("message:out", (msg) => {
//     console.log("Message OUT");
//     console.log(msg);
// });

module.exports = asteroid;
