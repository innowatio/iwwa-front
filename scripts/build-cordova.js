var BPromise = require("bluebird");
var chalk    = require("chalk");
var sh       = require("child_process").execSync;
var fs       = require("fs");
var minimist = require("minimist");
var semver   = require("semver");
var path     = require("path");
var xml2js   = require("xml2js");

var bin = {
    cordova: path.join(__dirname, "../node_modules/.bin/cordova")
};

var log = function (message, task) {
    return function () {
        var start;
        var end;
        return BPromise.bind(this)
            .then(function () {
                start = Date.now();
                process.stdout.write(chalk.yellow(`${message}...`));
            })
            .then(task)
            .then(function () {
                end = Date.now();
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(chalk.green(`${message}... OK (${end - start}ms)\n`));
            })
            .catch(function (err) {
                end = Date.now();
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(chalk.red(`${message}... KO (${end - start}ms)\n`));
                console.log(chalk.red(`Error: ${err.message}`));
                throw new Error(err);
            });
    };
};

var clean = function () {
    sh("rm -rf builds/cordova-app/");
    sh("rm -rf builds/cordova/");
};

var compile = function () {
    sh("env ENVIRONMENT=\"cordova\" npm run build");
};

var createCordovaApp = function () {
    sh(`${bin.cordova} create builds/cordova-app ${this.package} ${this.name}`);
};

var installCordovaPlugins = function () {
    this.plugins.forEach(function (plugin) {
        sh(`cd builds/cordova-app && ${bin.cordova} plugin add ${plugin}`);
    });
};

var installCordovaPlatforms = function () {
    sh(`cd builds/cordova-app && ${bin.cordova} platform add ${this.platform}`);
};

var configureCordovaApp = function () {
    if (semver.valid(this.version) === null) {
        throw new Error("Invalid version");
    }
    var appConfig = fs.readFileSync("builds/cordova-app/config.xml", "utf8");
    var parser = new xml2js.Parser();
    return BPromise.promisify(parser.parseString, parser)(appConfig)
        .bind(this)
        .then(function (xml) {

            xml.widget.$.version = this.version;
            xml.widget.$.id = this.name;
            xml.widget.platform = {$: {
                name: this.platform
            }};

            if (this.platform === "ios") {
                xml.widget.platform.icon = [
                    29,
                    40,
                    50,
                    57,
                    58,
                    60,
                    72,
                    76,
                    80,
                    100,
                    114,
                    120,
                    144,
                    152,
                    180
                ].map(function (size) {
                    return {
                        $: {
                            src: "www/_assets/app/icon/ios-" + size + "x" + size + ".png",
                            width: "" + size,
                            height: "" + size
                        }
                    };
                });
                xml.widget.platform.preference = [
                    {$: {
                        name: "Orientation",
                        value: "all"
                    }},
                    {$: {
                        name: "StatusBarOverlaysWebView",
                        value: "false"
                    }},
                    {$: {
                        name: "StatusBarBackgroundColor",
                        value: "#000000"
                    }},
                    {$: {
                        name: "DisallowOverscroll",
                        value: "true"
                    }},
                    {$: {
                        name: "StatusBarStyle",
                        value: "lightcontent"
                    }}
                ];
                xml.widget.platform.splash = [
                    ["320", "480"],
                    ["640", "960"],
                    ["640", "1136"],
                    ["750", "1334"],
                    ["768", "1024"],
                    ["1242", "2208"],
                    ["1536", "2048"],
                    ["1024", "768"],
                    ["2048", "1536"],
                    ["2208", "1242"]
                ].map(function (size) {
                    return {$: {
                        src: "www/_assets/app/splash/ios-" + size[0] + "x" + size[1] + ".png",
                        width: size[0],
                        height: size[1]
                    }};
                });
            }

            if (this.platform === "android") {
                xml.widget.platform.icon = [
                    [48, "mdpi"],
                    [72, "hdpi"],
                    [96, "xhdpi"],
                    [144, "xxhdpi"],
                    [192, "xxxhdpi"]
                ].map(function (size) {
                    return {$: {
                        src: "www/_assets/app/icon/android-" + size[0] + "x" + size[0] + ".png",
                        density: size[1]
                    }};
                });
                xml.widget.platform.splash = [
                    [320, 480, "mdpi"],
                    [480, 720, "hdpi"],
                    [640, 960, "xhdpi"],
                    [960, 1440, "xxhdpi"],
                    [1280, 1920, "xxxhdpi"]
                ].map(function (size) {
                    return {$: {
                        src: "www/_assets/app/splash/android-" + size[0] + "x" + size[1] + ".png",
                        density: "port-" + size[2]
                    }};
                });
            }

            var builder = new xml2js.Builder();
            var xmlString = builder.buildObject(xml);
            fs.writeFileSync("builds/cordova-app/config.xml", xmlString, "utf8");

        });
};

var buildCordovaApp = function () {
    sh("rm -rf builds/cordova-app/www");
    sh("mv builds/cordova builds/cordova-app/www");
    sh(`cd builds/cordova-app && ${bin.cordova} build ${this.platform}`);
};

var pkg = require(path.join(__dirname, "../package.json"));

var argv = minimist(process.argv.slice(2), {
    alias: {
        p: "platform"
    },
    default: {
        p: "ios"
    }
});

var config = {
    name: pkg.cordova.name,
    platform: argv.platform,
    version: pkg.cordova.version,
    plugins: pkg.cordova.plugins
};

BPromise.bind(config)
    .then(function () {
        console.log(chalk.green("Building app with config:"));
        console.log(JSON.stringify(config, null, 4));
    })
    .then(log("Cleaning workspace", clean))
    .then(log("Compiling project", compile))
    .then(log("Creating Cordova app", createCordovaApp))
    .then(log("Installing Cordova plugins", installCordovaPlugins))
    .then(log("Installing Cordova platforms", installCordovaPlatforms))
    .then(log("Configuring Cordova app", configureCordovaApp))
    .then(log("Building Cordova app", buildCordovaApp))
    .then(function () {
        console.log(chalk.green("Success"));
    })
    .catch(function () {
        console.log(chalk.red("Aborted"));
    });
