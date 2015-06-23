var BPromise    = require("bluebird");
var browserSync = require("browser-sync");
var sh          = require("child_process").execSync;
var fs          = require("fs");
var gulp        = require("gulp");
var gp          = require("gulp-load-plugins")();
var mkdirp      = require("mkdirp");
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
        .pipe(gulp.dest("builds/" + ENVIRONMENT + "/"))
        .on("end", browserSync.reload);
});

proGulp.task("buildAppScripts", (function () {
    var targetDir = "builds/" + ENVIRONMENT + "/assets/js/";
    mkdirp(targetDir);
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
        return BPromise.promisify(compiler.run, compiler)()
            .then(browserSync.reload);
    };
})());

proGulp.task("buildAppStyles", function () {
    return gulp.src("app/main.scss")
        .pipe(gp.sass())
        .pipe(gp.rename("app.css"))
        .pipe(gp.autoprefixer("last 3 version"))
        .pipe(gp.if(MINIFY_FILES, gp.minifyCss()))
        .pipe(gulp.dest("builds/" + ENVIRONMENT + "/assets/css/"))
        .on("end", browserSync.reload);
});

proGulp.task("buildVendorStyles", function () {
    return gulp.src(deps.css)
        .pipe(gp.concat("vendor.css"))
        .pipe(gp.if(MINIFY_FILES, gp.minifyCss()))
        .pipe(gulp.dest("builds/" + ENVIRONMENT + "/assets/css/"))
        .on("end", browserSync.reload);
});

proGulp.task("build", proGulp.parallel([
    "buildMainHtml",
    "buildAppScripts",
    "buildAppStyles",
    "buildVendorStyles"
]));

gulp.task("build", proGulp.task("build"));



/*
*   Tasks to setup the development environment
*/

proGulp.task("setupDevServer", function () {
    var reg = new RegExp("/assets/");
    browserSync({
        server: {
            baseDir: "./builds/" + ENVIRONMENT + "/",
            middleware: function (req, res, next) {
                if (!reg.test(req.url)) {
                    req.url = "/";
                }
                next();
            }
        },
        port: 8080,
        ghostMode: false,
        injectChanges: false,
        notify: false,
        open: false
    });
});

proGulp.task("setupWatchers", function () {
    gulp.watch("app/main.html", proGulp.sequence([
        "buildMainHtml"
    ]));
    gulp.watch("app/**/*.js", proGulp.sequence([
        "buildAppScripts"
    ]));
    gulp.watch("app/**/*.scss", proGulp.sequence([
        "buildAppStyles"
    ]));
});

gulp.task("dev", proGulp.sequence([
    "build",
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
