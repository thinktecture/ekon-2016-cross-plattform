'use strict';

const gulp = require('gulp'),
    del = require('del'),
    config = require('./gulpConfig'),
    runSequence = require('run-sequence'),
    tsc = require('gulp-typescript'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    count = require('gulp-count'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    sh = require('shelljs'),
    pump = require('pump'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    inject = require('gulp-inject'),
    Builder = require('systemjs-builder');

gulp.task('dist:clean', () => del([config.targets.build, config.targets.dist.web]));

gulp.task('dist:scripts:aot', () => {
    return gulp.src(`${config.base}/app/**/*.*`)
        .pipe(gulp.dest(`${config.targets.build}/aot/app`))
        .on('end', () => {
            sh.exec('$(npm bin)/ngc -p tsconfig-aot.json');
        })
});

gulp.task('dist:scripts:es2015', () => {
    const tsProject = tsc.createProject('tsconfig-aot.json');
    const tsResult = gulp.src(`${config.targets.build}/aot/**/*.ts`)
        .pipe(tsProject());

    return tsResult.js.pipe(gulp.dest(`${config.targets.build}`));
});

gulp.task('dist:scripts:es5', () => {
    return gulp.src([
        `${config.targets.build}/app.es2015.js`,
        'typings/index.d.ts'
    ])
        .pipe(tsc(config.typescript.dist))
        .pipe(rename('app.es5.js'))
        .pipe(gulp.dest(config.targets.build));
});

gulp.task('dist:scripts:minify', done => {
    pump([
        gulp.src(`${config.targets.build}/app.js`),
        uglify(),
        rename('app.min.js'),
        gulp.dest(`${config.targets.dist.web}`)
    ], done);
});

gulp.task('dist:bundle', () => {
    const builder = new Builder(config.targets.build, `${config.base}/systemSetup.js`);

    builder.config({ transpiler: false });

    return builder.buildStatic(`app/main.aot.js`, `${config.targets.build}/app.es2015.js`, {
        runtime: false,
        minify: false,
        mangle: false,
        normalize: true,
        rollup: true
    });
});

gulp.task('dist:concat', () => {
    return gulp.src([
        ...config.vendorScripts,
        `${config.targets.build}/app.es5.js`
    ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest(config.targets.build));
});

gulp.task('dist:assets', () => {
    return gulp.src(config.sources.assets)
        .pipe(gulp.dest(`${config.targets.dist.web}/assets`));
});

gulp.task('dist:i18n', () => {
    return gulp.src(config.sources.i18n)
        .pipe(gulp.dest(`${config.targets.dist.web}/i18n`));

});

gulp.task('dist:index', () => {
    const injectables = gulp.src([
            `${config.targets.dist.web}/app.min.js`,
            `${config.targets.dist.web}/css/app.min.css`
        ],
        { read: false });

    return gulp.src(config.index)
        .pipe(inject(injectables, {
            addRootSlash: false,
            ignorePath: config.targets.dist.web
        }))
        .pipe(gulp.dest(config.targets.dist.web));
});

gulp.task('dist:styles', () => {
    return gulp.src(config.sources.styles.main)
        .pipe(less())
        .pipe(autoprefixer({ browsers: config.browsers }))
        .pipe(cleanCSS())
        .pipe(rename('app.min.css'))
        .pipe(gulp.dest(`${config.targets.dist.web}/css`))
});

gulp.task('dist-build', done => {
    runSequence(
        'dist:clean',
        'dist:scripts:aot',
        'dist:scripts:es2015',
        'dist:bundle',
        'dist:scripts:es5',
        'dist:concat',
        'dist:scripts:minify',
        [
            'dist:i18n',
            'dist:assets',
            'dist:styles'
        ],
        'dist:index',
        done
    );
});
