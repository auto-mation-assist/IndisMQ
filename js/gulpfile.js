var gulp = require("gulp"),
    browserify = require("browserify"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    tslint = require("gulp-tslint"),
    tsc = require("gulp-typescript"),
    sourcemaps = require("gulp-sourcemaps"),
    uglify = require("gulp-uglify"),
    runSequence = require("run-sequence"),
    mocha = require("gulp-mocha"),
    istanbul = require("gulp-istanbul"),
    browserSync = require('browser-sync').create();

gulp.task("lint", function () {
    return gulp.src([
        "**.ts",
        ".test.ts"
    ])
        .pipe(tslint({}))
        .pipe(tslint.report("verbose"));
});

var tsProject = tsc.createProject("tsconfig.json");

gulp.task("build-app", function() {
    return gulp.src([
            "**.ts",
            //"typings/main.d.ts/",
            //"source/interfaces/interfaces.d.ts"
        ])
        .pipe(tsc(tsProject))
        .js.pipe(gulp.dest("build/"));
});
gulp.task("bundle", function() {

    var libraryName = "myapp";
    var mainTsFilePath = "build/testServer.js";
    var outputFolder   = "dist/";
    var outputFileName = libraryName + ".min.js";

    var bundler = browserify({
        debug: true,
        standalone : libraryName
    });

    return bundler.add(mainTsFilePath)
        .bundle()
        .pipe(source(outputFileName))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(outputFolder));
});
gulp.task("watch", ["default"], function () {

    browserSync.init({
        server: "."
    });

    gulp.watch([ "**.ts", "**.ts"], ["default"]);
    gulp.watch("dist/*.js").on('change', browserSync.reload); 
});