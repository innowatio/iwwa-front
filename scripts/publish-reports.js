var sh          = require("child_process").execSync;
var fs          = require("fs");
var gulp        = require("gulp");
var gp          = require("gulp-load-plugins")();
var mkdirp      = require("mkdirp");
var proGulp     = require("pro-gulp");
var eslReporter = require("eslint-html-reporter");

proGulp.task("generateMochaReport", function () {
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

proGulp.task("generateEsLintReport", function () {
    var targetDir = "builds/_reports/eslint/";
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

proGulp.sequence([
    "generateMochaReport",
    "generateEsLintReport",
    "generateScssLintReport"
])().then(function () {
    return gulp.src("./builds/_reports/**/*")
        .pipe(gp.ghPages());
});
