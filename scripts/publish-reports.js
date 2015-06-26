var gulp = require("gulp");
var gp   = require("gulp-load-plugins")();

require("./generate-reports.js").then(function () {
    return gulp.src("./builds/_reports/**/*")
        .pipe(gp.ghPages())
        .on("data", function () {
            /*
            *   Ignore, we register the event otherwise the process exits
            */
        });
});
