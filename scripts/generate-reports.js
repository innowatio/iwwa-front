var sh          = require("child_process").execSync;
var fs          = require("fs");
var gulp        = require("gulp");
var gp          = require("gulp-load-plugins")();
var mkdirp      = require("mkdirp");
var proGulp     = require("pro-gulp");
var eslReporter = require("eslint-html-reporter");

var rm = function (target) {
    try {
        sh("rm -r " + target);
    } catch (e) {
        console.log(e.message);
    }
};

proGulp.task("generateMochaReport", function () {
    var targetDir = "./builds/_reports/unit-tests/";
    rm(targetDir);
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
    rm(targetDir);
    mkdirp.sync(targetDir);
    return gulp.src(["app/**/**.js", "app/**/**.jsx"])
        .pipe(gp.eslint())
        .pipe(gp.eslint.format(eslReporter, function (results) {
            fs.writeFileSync(targetDir + "index.html", results);
        }));
});

module.exports = proGulp.parallel([
    "generateMochaReport",
    "generateEsLintReport"
])();
