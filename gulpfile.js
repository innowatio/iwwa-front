var BPromise    = require("bluebird");
var browserSync = require("browser-sync");
var sh          = require("child_process").execSync;
var fs          = require("fs");
var gulp        = require("gulp");
var gp          = require("gulp-load-plugins")();
var mkdirp      = require("mkdirp");
var mocha       = require("mocha");
var path        = require("path");
var proGulp     = require("pro-gulp");
var R           = require("ramda");
var webpack     = require("webpack");



/*
*   Constants
*/

var ENVIRONMENT  = process.env.ENVIRONMENT || "dev";
var MINIFY_FILES = (process.env.MINIFY_FILES === "true") || false;

var deps = JSON.parse(fs.readFileSync("deps.json", "utf8"));

/*
*   Builders
*/

proGulp.task("buildMainHtml", function () {
    return gulp.src("app/main.html")
        .pipe(gp.preprocess({context: {
            ENVIRONMENT: ENVIRONMENT
        }}))
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
            loaders: [{
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel"
            }]
        },
        resolve: {
            root: path.join(__dirname, "app"),
            extensions: ["", ".web.js", ".js", ".jsx"]
        },
        plugins: [
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

proGulp.task("buildAppStyles", function () {
    return gulp.src("app/main.scss")
        .pipe(gp.sass())
        .pipe(gp.rename("app.css"))
        .pipe(gp.autoprefixer("last 3 version"))
        .pipe(gp.if(MINIFY_FILES, gp.minifyCss()))
        .pipe(gulp.dest("builds/" + ENVIRONMENT + "/_assets/css/"));
});

proGulp.task("buildVendorStyles", function () {
    return gulp.src(deps.css)
        .pipe(gp.concat("vendor.css"))
        .pipe(gp.if(MINIFY_FILES, gp.minifyCss()))
        .pipe(gulp.dest("builds/" + ENVIRONMENT + "/_assets/css/"));
});

proGulp.task("build", proGulp.parallel([
    "buildMainHtml",
    "buildAppScripts",
    "buildAppStyles",
    "buildVendorStyles"
]));

gulp.task("build", proGulp.task("build"));



/*
*   Testers
*/

proGulp.task("runUnitTests", function () {
    var targetDir = "./builds/_reports/unit-tests/";
    mkdirp.sync(targetDir);
    return gulp.src("./test/unit/**/*.jsx")
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
*   Publish reports to gh-pages
*/

gulp.task("publishReports", function () {
    return gulp.src("./builds/_reports/**/*")
        .pipe(gp.ghPages());
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
        ["test/unit/**/*.jsx", "test/unit/**/*.js"],
        proGulp.task("runUnitTests")
    );
    gulp.watch(
        "app/**/*.scss",
        proGulp.task("buildAppStyles")
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
    gp.util.log("  " + gp.util.colors.cyan("ENVIRONMENT") + "     (defaults to `dev`)");
    gp.util.log("  " + gp.util.colors.cyan("MINIFY_FILES") + "    (defaults to `false`)");
    gp.util.log("");
});
