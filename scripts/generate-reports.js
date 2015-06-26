var sh          = require("child_process").execSync;
var fs          = require("fs");
var gulp        = require("gulp");
var gp          = require("gulp-load-plugins")();
var mkdirp      = require("mkdirp");
var proGulp     = require("pro-gulp");
var eslReporter = require("eslint-html-reporter");

proGulp.task("generateMochaReport", function () {
    var targetDir = "./builds/_reports/unit-tests/";
    sh("rm -r " + targetDir);
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

proGulp.task("generateEsLintReport", function () {
    var targetDir = "builds/_reports/eslint/";
    sh("rm -r " + targetDir);
    mkdirp.sync(targetDir);
    return gulp.src(["app/**/**.js", "app/**/**.jsx"])
        .pipe(gp.eslint())
        .pipe(gp.eslint.format(eslReporter, function (results) {
            fs.writeFileSync(targetDir + "index.html", results);
        }));
});

proGulp.task("generateScssLintReport", function () {
    var targetDir = "./builds/_reports/scss-lint/";
    var reporterPath = "node_modules/.bin/scss-lint-html-reporter";
    sh("rm -r " + targetDir);
    mkdirp.sync(targetDir);
    // Generate the report
    try {
        sh([
            "scss-lint app/ -c .scss-lint.yml -f JSON",
            "node " + reporterPath + " -o " + targetDir + "index.html"
        ].join(" | "));
    } catch (ignore) {
        // Prevent exiting the process on errors
    }
});

module.exports = proGulp.parallel([
    "generateMochaReport",
    "generateEsLintReport",
    "generateScssLintReport"
])();
