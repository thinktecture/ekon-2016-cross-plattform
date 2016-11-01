'use strict';

const gulp = require('gulp'),
    del = require('del'),
    config = require('./gulpConfig'),
    sourceMaps = require('gulp-sourcemaps'),
    inlineNg2Template = require('gulp-inline-ng2-template'),
    tsc = require('gulp-typescript'),
    count = require('gulp-count'),
    less = require('gulp-less'),
    batch = require('gulp-batch'),
    autoprefixer = require('gulp-autoprefixer'),
    watch = require('gulp-watch'),
    runSequence = require('run-sequence'),
    path = require('path'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync').create(),
    inject = require('gulp-inject'),
    Builder = require('systemjs-builder');

gulp.task('dev:clean', () => del(config.targets.build));

function createTypeScriptPipe(sources, fastTranspilation) {
    const tsOptions = Object.assign({}, config.typescript.dev, {
        isolatedModules: !!fastTranspilation
    });

    const ts = sources
        .pipe(plumber())
        .pipe(inlineNg2Template({
            useRelativePaths: true
        }))
        .pipe(sourceMaps.init())
        .pipe(tsc(tsOptions));

    return ts.js
       // .pipe(count('Transpiled ## files'))
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest(config.targets.build))
        .on('end', () => browserSync.reload());
}

gulp.task('dev:scripts', () => createTypeScriptPipe(gulp.src([
    ...config.sources.scripts,
    'typings/index.d.ts'
])));

gulp.task('dev:scripts:watch', () => watch([...config.sources.scripts],
    batch(events => createTypeScriptPipe(events, true))));


function getTypeScriptFilesFromTemplateFiles(source) {
    const result = [];
    let file;

    while (file = source.read()) {
        file.extname = '.ts';
        result.push(file.path);
    }

    return result;
}

gulp.task('dev:templates:watch', () => watch([...config.sources.templates],
    batch(events => createTypeScriptPipe(gulp.src(getTypeScriptFilesFromTemplateFiles(events), { base: config.base }), true))));

function createLessPipe(sources) {
    return sources
        .pipe(sourceMaps.init())
        .pipe(less())
        .pipe(autoprefixer({ browsers: config.browsers }))
        //.pipe(count('Preprocessed ## style files'))
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest(`${config.targets.build}/css`))
        .pipe(browserSync.stream({ match: '**/*.css' }));
}

gulp.task('dev:styles', () => createLessPipe(gulp.src(config.sources.styles.main)));

gulp.task('dev:styles:watch', () => watch(config.sources.styles.all,
    batch(events => createLessPipe(gulp.src(config.sources.styles.main)))));

function createI18nPipe(sources) {
    return sources
        //.pipe(count('Copied ## i18n files'))
        .pipe(gulp.dest(`${config.targets.build}/i18n`))
        .on('end', () => browserSync.reload());
}

gulp.task('dev:i18n', () => createI18nPipe(gulp.src(config.sources.i18n)));

gulp.task('dev:i18n:watch', () => watch(config.sources.i18n,
    batch(events => createI18nPipe(events))));

gulp.task('dev:watch:init', done => {
    browserSync.init(config.browserSync, done);
});

gulp.task('dev:vendorScripts', () => {
    return gulp.src([
        ...config.vendorScripts,
        ...config.devScripts,
    ])
        .pipe(gulp.dest(config.targets.lib));
});

gulp.task('dev:fonts', () => {
    return gulp.src(config.sources.fonts)
        .pipe(gulp.dest(config.targets.fonts));
});

gulp.task('dev:nodeModules', () => {
    return gulp.src(config.nodeModules.map(m => path.join('node_modules', m, '**/*.{js,map}')), { base: 'node_modules' })
        .pipe(gulp.dest(config.targets.lib));
});

gulp.task('dev:systemJs', () => {
    return gulp.src(config.systemJs)
        .pipe(gulp.dest(config.targets.build))
        .on('end', () => browserSync.reload());
});

gulp.task('dev:systemJs:watch', () => watch(config.systemJs,
    batch((events, done) => runSequence('dev:systemJs', done))));

gulp.task('dev:index', () => {
    const injectables = gulp.src(config.injectables,
        { read: false });

    return gulp.src(config.index)
        .pipe(inject(injectables, {
            addRootSlash: false,
            ignorePath: config.targets.build
        }))
        .pipe(gulp.dest(config.targets.build))
        .on('end', () => browserSync.reload());
});

gulp.task('dev:index:watch', () => watch(config.index,
    batch((events, done) => runSequence('dev:index', done))));

// https://github.com/angular/angular/issues/9359#issuecomment-247409174
gulp.task('dev:bundle:rxjs', () => {
    const options = {
        normalize: true,
        runtime: false,
        minify: false,
        mangle: false
    };

    const builder = new Builder('./');
    builder.config({
        paths: {
            'n:*': 'node_modules/*',
            'rxjs/*': 'node_modules/rxjs/*.js',
        },
        map: {
            'rxjs': 'n:rxjs',
        },
        packages: {
            'rxjs': { main: 'Rx.js', defaultExtension: 'js' },
        }
    });

    return builder.bundle('rxjs', `${config.targets.lib}/rxjs/Rx.js`, options);
});

gulp.task('dev:assets', () => {
    return gulp.src(config.sources.assets)
        .pipe(gulp.dest(config.targets.assets));
});

gulp.task('dev:watch', done => {
    runSequence(
        'dev:watch:init',
        [
            'dev:scripts:watch',
            'dev:styles:watch',
            'dev:templates:watch',
            'dev:systemJs:watch',
            'dev:index:watch',
            'dev:i18n:watch'
        ],
        done
    );
});

gulp.task('dev-build', done => {
    runSequence(
        'dev:clean',
        [
            'dev:fonts',
            'dev:assets',
            'dev:vendorScripts',
            'dev:nodeModules',
            'dev:scripts',
            'dev:styles',
            'dev:systemJs',
            'dev:i18n',
            'dev:bundle:rxjs'
        ],
        [
            'dev:index'
        ],
        done
    );
});

gulp.task('dev-watch', done => {
    runSequence(
        'dev-build',
        'dev:watch',
        done
    );
});
