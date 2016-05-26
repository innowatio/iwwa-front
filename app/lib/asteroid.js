import {createClass} from "asteroid";
var collectionMixin = require("asteroid-immutable-collections-mixin");

var reactMixin = require("./asteroid-react.js");
import {READ_BACKEND_ENDPOINT} from "./config";

var Asteroid = createClass([reactMixin, collectionMixin]);

var asteroid = new Asteroid({
    endpoint: READ_BACKEND_ENDPOINT
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
