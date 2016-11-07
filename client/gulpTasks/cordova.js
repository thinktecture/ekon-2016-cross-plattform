'use strict';

const os = require('os'),
    gulp = require('gulp'),
    del = require('del'),
    config = require('./gulpConfig'),
    path = require('path'),
    sh = require('shelljs'),
    inject = require('gulp-inject'),
    rename = require('gulp-rename'),
    watch = require('gulp-watch'),
    batch = require('gulp-batch'),
    replace = require('gulp-replace'),
    runSequence = require('run-sequence');

const cordovaWwwFolder = path.join(config.targets.cordova, 'www');

function executeInCordovaFolder(action) {
    const currentDir = process.cwd();

    try {
        sh.cd(config.targets.cordova);
        action();
    }
    finally {
        sh.cd(currentDir);
    }
}

gulp.task('cordova:clean:all', () => del(config.targets.cordova));

gulp.task('cordova:clean:www', () => del(cordovaWwwFolder));

gulp.task('cordova:copy:config', () => {
    return gulp.src(config.sources.buildAssets.config)
        .pipe(gulp.dest(config.targets.cordova));
});

gulp.task('cordova:copy-build-json', () => {
    return gulp.src(config.sources.buildAssets.buildJson)
        .pipe(replace('$IOS_DEV_TEAM_ID$', process.env.IOS_DEV_TEAM_ID))
        .pipe(gulp.dest(config.targets.cordova));
});

gulp.task('cordova:copy:config:livereload', () => {
    const hostname = os.hostname();

    return gulp.src(config.sources.buildAssets.configLiveReload)
        .pipe(replace('${hostname}', hostname))
        .pipe(rename('config.xml'))
        .pipe(gulp.dest(config.targets.cordova));
});

gulp.task('cordova:copy:cordovaJs', () => {
    return gulp.src(config.sources.buildAssets.cordovaJs)
        .pipe(gulp.dest(config.targets.cordova));
});

gulp.task('cordova:index', () => {
    const injectables = gulp.src(config.injectables,
        { read: false });

    return gulp.src(config.index)
        .pipe(inject(injectables, {
            addRootSlash: false,
            ignorePath: config.targets.build
        }))
        .pipe(inject(gulp.src(path.join(config.targets.cordova, 'cordova.js')), {
            addRootSlash: false,
            ignorePath: config.targets.cordova,
            name: 'cordova'
        }))
        .pipe(gulp.dest(config.targets.build));
});

gulp.task('cordova:copy:hooks', () => {
    return gulp.src(config.sources.buildAssets.hooks)
        .pipe(gulp.dest(path.join(config.targets.cordova, 'hooks')));
});

gulp.task('cordova:copy:app', () => {
    return gulp.src(path.join(config.targets.build, '**/*'))
        .pipe(gulp.dest(cordovaWwwFolder))
});

gulp.task('cordova-start-ios-on-device', (done) => {
    runSequence(
        ['dev-build', 'cordova:clean:all'],
        'cordova:copy:cordovaJs',
        'cordova:index',
        ['cordova:copy:config', 'cordova:copy-build-json', 'cordova:copy:hooks', 'cordova:copy:app'],
        'cordova:prepare-ios',
        'cordova:prepare-ios', // Prepare twice due to install of plugins during the first prepare cycle
        'cordova:icon-and-splash',
        'cordova:cdv-build-ios',
        'cordova:run-ios',
        done
    );

});

gulp.task('cordova:run-ios', function () {
    executeInCordovaFolder(() => {
        sh.exec('$(npm bin)/cordova run ios --device');
    });
});

gulp.task('cordova-start-ios', (done) => {
    runSequence(
        'cordova:clean:all',
        'cordova:copy:cordovaJs',
        'cordova:index',
        ['cordova:copy:config', 'cordova:copy-build-json', 'cordova:copy:hooks', 'cordova:copy:app'],
        'cordova:prepare-ios',
        'cordova:prepare-ios', // Prepare twice due to install of plugins during the first prepare cycle
        'cordova:icon-and-splash',
        //'cordova:cdv-build-ios',
        'cordova:emulate-ios',
        done
    );
});

gulp.task('cordova:emulate-ios', () => {
    executeInCordovaFolder(() => {
        sh.exec('$(npm bin)/cordova emulate ios --target="iPhone-7-Plus, 10.1"');
    });
});

gulp.task('cordova-start-android', (done) => {
    runSequence('cordova-build-android', 'cordova-run-on-device-android', done);
});

gulp.task('cordova-run-on-device-android', () => {
    executeInCordovaFolder(() => {
        sh.exec('$(npm bin)/cordova run android --emulate');
    });
});

gulp.task('cordova:prepare', () => {
    executeInCordovaFolder(() => {
        sh.exec('$(npm bin)/cordova prepare');
    });
});

gulp.task('cordova:prepare-ios', () => {
    executeInCordovaFolder(() => {
        sh.exec('$(npm bin)/cordova prepare ios');
    });
});

gulp.task('cordova:prepare-android', () => {
    executeInCordovaFolder(() => {
        sh.exec('$(npm bin)/cordova prepare android');
    });
});

gulp.task('cordova:prepare-uwp', () => {
    executeInCordovaFolder(() => {
        sh.exec('$(npm bin)/cordova prepare windows');
    });
});

gulp.task('cordova:cdv-build-android', () => {
    executeInCordovaFolder(() => {
        sh.exec('$(npm bin)/cordova build android');
    });
});

gulp.task('cordova:cdv-build-ios', () => {
    executeInCordovaFolder(() => {
        sh.exec(`$(npm bin)/cordova build ios --buildConfig ./build.json`);
    });
});

gulp.task('cordova:icon-and-splash', () => {
    return gulp.src(config.sources.buildAssets.icons)
        .pipe(gulp.dest(config.targets.cordova))
        .on('end', () => {
            executeInCordovaFolder(() => {
                sh.exec('$(npm bin)/cordova-icon');
                sh.exec('$(npm bin)/cordova-splash');
            });
        });
});

function copyChanges(sources, platform) {
    return sources
        .pipe(gulp.dest(getBaseServerDir(platform)));
}

gulp.task('cordova:watch:ios', () => watch(`${config.targets.build}/**/*.*`,
    batch((events, done) => copyChanges(events, 'ios'))));

function getBaseServerDir(platform) {
    return path.join('dist', 'mobile', 'platforms', platform, 'www');
}

function setBrowserSyncConfig(platform) {
    config.browserSync.server.baseDir = getBaseServerDir(platform);
    config.browserSync.open = false;
}

function runWatchSequence(done, platform) {
    runSequence(
        'dev-build',
        'cordova:clean:all',
        'cordova:copy:cordovaJs',
        'cordova:index',
        ['cordova:copy-build-json', 'cordova:copy:config:livereload', 'cordova:copy:hooks', 'cordova:copy:app'],
        'cordova:prepare',
        'cordova:prepare', // Prepare twice due to install of plugins during the first prepare cycle
        'cordova:icon-and-splash',
        [
            'dev:watch',
            'cordova:watch:' + platform
        ],
        done
    );
}

gulp.task('cordova-watch-ios', done => {
    setBrowserSyncConfig('ios');
    runWatchSequence(done, 'ios');
});

gulp.task('cordova-build-ios', done => {
    runSequence(
        ['dev-build', 'cordova:clean:all'],
        'cordova:copy:cordovaJs',
        'cordova:index',
        ['cordova:copy:config', 'cordova:copy-build-json', 'cordova:copy:hooks', 'cordova:copy:app'],
        'cordova:prepare-ios',
        'cordova:prepare-ios', // Prepare twice due to install of plugins during the first prepare cycle
        'cordova:icon-and-splash',
        'cordova:cdv-build-ios',
        done
    );
});

gulp.task('cordova-build-android', done => {
    runSequence(
        'cordova:clean:all',
        'cordova:copy:cordovaJs',
        'cordova:index',
        ['cordova:copy:config', 'cordova:copy-build-json', 'cordova:copy:hooks', 'cordova:copy:app'],
        'cordova:prepare-android',
        'cordova:prepare-android', // Prepare twice due to install of plugins during the first prepare cycle
        'cordova:icon-and-splash',
        // 'cordova:cdv-build-android',
        done
    );
});

gulp.task('cordova-build-uwp', done => {
    runSequence(
        'cordova:clean:all',
        'cordova:copy:cordovaJs',
        'cordova:index',
        ['cordova:copy:config', 'cordova:copy-build-json', 'cordova:copy:hooks', 'cordova:copy:app'],
        'cordova:prepare-uwp',
        'cordova:prepare-uwp', // Prepare twice due to install of plugins during the first prepare cycle
        'cordova:icon-and-splash',
        done
    );
});

gulp.task('cordova-build', done => {
    runSequence(
        ['dev-build', 'cordova:clean:all'],
        'cordova:copy:cordovaJs',
        'cordova:index',
        ['cordova:copy:config', 'cordova:copy-build-json', 'cordova:copy:hooks', 'cordova:copy:app'],
        'cordova:prepare',
        'cordova:prepare', // Prepare twice due to install of plugins during the first prepare cycle
        'cordova:icon-and-splash',
        ['cordova:cdv-build-ios', 'cordova:cdv-build-android'],
        done
    );
});

gulp.task('cordova-update', done => {
    runSequence(
        'dev-build',
        'cordova:clean:www',
        'cordova:copy:cordovaJs',
        'cordova:index',
        ['cordova:copy:config', 'cordova:copy-build-json', 'cordova:copy:hooks', 'cordova:copy:app'],
        'cordova:prepare',
        done
    )
});
