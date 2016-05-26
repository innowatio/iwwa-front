var BPromise = require("bluebird");
var devip    = require("dev-ip");
var fs       = require("fs");
var R        = require("ramda");

var getIp = function () {
    return R.find(function (ip) {
        return (
            ip.slice(0, 3) === "192" ||
            ip.slice(0, 2) === "10"
        );
    }, devip());
};

function getEnvirnomentVariables () {

        // READ_BACKEND_ENDPOINT: "wss://iwwa-back-development.innowatio-aws.com/websocket",
        // WRITE_API_ENDPOINT: "iwwa-write-api-development.eu-west-1.elasticbeanstalk.com"

    return {
        READ_BACKEND_ENDPOINT: process.env.READ_BACKEND_ENDPOINT || `ws://${getIp()}:3000/websocket`,
        WRITE_API_ENDPOINT: process.env.WRITE_API_ENDPOINT || getIp() + ":3000"
    };
}

BPromise.resolve()
    .then(() => {
        const variables = getEnvirnomentVariables();
        var env = Object.keys(variables)
            .map(key => `${key}=${variables[key]}`)
            .join("\n");
        fs.writeFileSync(".env", env, "utf8");
    });
