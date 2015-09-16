var BPromise    = require("bluebird");
var browserSync = require("browser-sync");
var devip       = require("dev-ip");
var fs          = require("fs");
var gulp        = require("gulp");
var gp          = require("gulp-load-plugins")();
var mkdirp      = require("mkdirp");
var path        = require("path");
var proGulp     = require("pro-gulp");
var R           = require("ramda");
var webpack     = require("webpack");



var getIp = function () {
    return R.find(function (ip) {
        return (
            ip.slice(0, 3) === "192" ||
            ip.slice(0, 2) === "10"
        );
    }, devip());
};



/*
*   Constants
*/

var ENVIRONMENT  = process.env.ENVIRONMENT || "dev";
var WRITE_BACKEND_HOST = process.env.WRITE_BACKEND_HOST || getIp() + ":3000";
var READ_BACKEND_HOST = process.env.READ_BACKEND_HOST || getIp() + ":3000";
var MINIFY_FILES = (process.env.MINIFY_FILES === "true") || false;

var deps = JSON.parse(fs.readFileSync("deps.json", "utf8"));



/*
*   Builders
*/

proGulp.task("buildMainHtml", function () {
    return gulp.src("app/main.html")
        .pipe(gp.preprocess({context: {ENVIRONMENT: ENVIRONMENT}}))
        .pipe(gp.rename("index.html"))
        .pipe(gulp.dest("builds/" + ENVIRONMENT + "/"));
});

proGulp.task("buildAppScripts", (function () {
    var targetDir = "builds/" + ENVIRONMENT + "/_assets/js/";
    mkdirp.sync(targetDir);
    var compiler = webpack({
        entry: {
            app: "./app/main.jsx",
            vendor: deps.js
        },
        output: {
            filename: targetDir + "app.js"
        },
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: "babel"
                },
                {
                    test: /\.json$/,
                    loader: "json"
                }
            ]
        },
        resolve: {
            root: path.join(__dirname, "app"),
            extensions: ["", ".web.js", ".js", ".jsx"]
        },
        plugins: [
            new webpack.DefinePlugin({
                ENVIRONMENT: JSON.stringify(ENVIRONMENT),
                READ_BACKEND_HOST: JSON.stringify(READ_BACKEND_HOST),
                WRITE_BACKEND_HOST: JSON.stringify(WRITE_BACKEND_HOST)
            }),
            new webpack.optimize.CommonsChunkPlugin(
                "vendor",
                targetDir + "vendor.js"
            ),
            MINIFY_FILES ? new webpack.optimize.UglifyJsPlugin() : null
        ].filter(R.identity)
    });
    return function () {
        return BPromise.promisify(compiler.run, compiler)();
    };
})());

proGulp.task("buildAppAssets", function () {
    return gulp.src("app/assets/**/*")
        .pipe(gulp.dest("builds/" + ENVIRONMENT + "/_assets/"));
});

proGulp.task("buildVendorStyles", function () {
    return gulp.src(deps.css)
        .pipe(gp.concat("vendor.css"))
        .pipe(gp.if(MINIFY_FILES, gp.minifyCss()))
        .pipe(gulp.dest("builds/" + ENVIRONMENT + "/_assets/css/"));
});

proGulp.task("buildVendorFonts", function () {
    return gulp.src(deps.fonts)
        .pipe(gulp.dest("builds/" + ENVIRONMENT + "/_assets/fonts/"));
});

proGulp.task("build", proGulp.parallel([
    "buildMainHtml",
    "buildAppScripts",
    "buildAppAssets",
    "buildVendorStyles",
    "buildVendorFonts"
]));

gulp.task("build", proGulp.task("build"));



/*
*   Testers
*/

proGulp.task("runUnitTests", function () {
    var targetDir = "./builds/_reports/unit-tests/";
    mkdirp.sync(targetDir);
    return gulp.src("./test/unit/**/*unit*")
        .pipe(gp.spawnMocha({
            compilers: "jsx:babel/register",
            reporter: "mochawesome",
            env: {
                NODE_PATH: "app:test",
                MOCHAWESOME_REPORTDIR: targetDir,
                MOCHAWESOME_REPORTNAME: "index"
            }
        }))
        .on("error", function () {
            // Swallow errors
            this.emit("end");
        });
});



/*
*   Tasks to setup the development environment
*/

proGulp.task("setupDevServer", function () {
    var isAsset = R.test(/_assets/);
    var isReport = R.test(/_report/);
    browserSync({
        server: {
            baseDir: "builds/",
            middleware: function (req, res, next) {
                /*
                *   Set correct urls for `_assets` and `_reports`
                */
                if (isAsset(req.url)) {
                    req.url = "/" + ENVIRONMENT + req.url;
                } else if (!isReport(req.url)) {
                    req.url = "/" + ENVIRONMENT + "/index.html";
                }
                next();
            }
        },
        files: "./builds/**/*",
        port: 8080,
        ghostMode: false,
        injectChanges: false,
        notify: false,
        open: false
    });
});

proGulp.task("setupWatchers", function () {
    gulp.watch(
        "app/main.html",
        proGulp.task("buildMainHtml")
    );
    gulp.watch(
        ["app/**/*.jsx", "app/**/*.js"],
        proGulp.parallel(["buildAppScripts", "runUnitTests"])
    );
    gulp.watch(
        "app/assets/**/*",
        proGulp.task("buildAppAssets")
    );
    gulp.watch(
        ["test/unit/**/*.jsx", "test/unit/**/*.js"],
        proGulp.task("runUnitTests")
    );
});

gulp.task("dev", proGulp.sequence([
    "build",
    "runUnitTests",
    "setupDevServer",
    "setupWatchers"
]));



/*
*   Default task, used for command line documentation
*/

gulp.task("default", function () {
    gp.util.log("");
    gp.util.log("Usage: " + gp.util.colors.blue("gulp [TASK]"));
    gp.util.log("");
    gp.util.log("Available tasks:");
    gp.util.log("  " + gp.util.colors.green("build") + "   build the application (use environment variables to customize the build)");
    gp.util.log("  " + gp.util.colors.green("dev") + "     set up dev environment with auto-recompiling");
    gp.util.log("");
    gp.util.log("Environment variables for configuration:");
    gp.util.log("  " + gp.util.colors.cyan("READ_BACKEND_HOST") + "    (defaults to `" + getIp() + ":3000`)");
    gp.util.log("  " + gp.util.colors.cyan("WRITE_BACKEND_HOST") + "    (defaults to `" + getIp() + ":3000`)");
    gp.util.log("  " + gp.util.colors.cyan("ENVIRONMENT") + "     (defaults to `dev`)");
    gp.util.log("  " + gp.util.colors.cyan("MINIFY_FILES") + "    (defaults to `false`)");
    gp.util.log("");
});
