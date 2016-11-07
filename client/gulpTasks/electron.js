'use strict';

const gulp = require('gulp'),
    del = require('del'),
    config = require('./gulpConfig'),
    path = require('path'),
    symdest = require('gulp-symdest'),
    electron = require('gulp-awesome-electron'),
    fs = require('fs'),
    runSequence = require('run-sequence');

const windowsFolder = 'windows',
    linuxFolder = 'linux',
    macosFolder = 'macos';

gulp.task('electron:clean-windows', () => del(path.join(config.targets.electron, windowsFolder)));
gulp.task('electron:clean-macos', () => del(path.join(config.targets.electron, macosFolder)));
gulp.task('electron:clean-linux', () => del(path.join(config.targets.electron, linuxFolder)));

function buildAppFor(targetPlatform, target) {
    return gulp.src([
        path.join(config.targets.build, '**', '*'),
        config.sources.buildAssets.electron
    ])
        .pipe(electron({
            version: '1.4.3',
            platform: targetPlatform,
            arch: 'x64',
            companyName: 'Thinktecture AG',
            cache: path.join(process.env.HOME, '.electron'),
            linuxExecutableName: config.name,
            darwinIcon: path.join(config.sources.buildAssets.iconsFolder, 'icon.icns'),
            winIcon: path.join(config.sources.buildAssets.iconsFolder, 'icon.ico')
        }))
        .pipe(symdest(path.join(config.targets.electron, target)));
}

gulp.task('electron:create-package-json', () => {
    const packageJson = {
        name: config.name,
        version: config.version,
        main: 'index.js'
    };

    fs.writeFileSync(path.join(config.targets.build, 'package.json'), JSON.stringify(packageJson));
});

gulp.task('electron:build-windows', () => {
    return buildAppFor('win32', 'windows');
});

gulp.task('electron:build-macos', () => {
    return buildAppFor('darwin', 'macos');
});

gulp.task('electron:build-linux', () => {
    return buildAppFor('linux', 'linux');
});

gulp.task('electron:build-apps', done => {
    runSequence(
        'electron:build-windows',
        'electron:build-macos',
        'electron:build-linux',
        done
    );
});

gulp.task('electron-build', done => {
    runSequence(
        'dev-build',
        ['electron:clean-windows', 'electron:clean-macos', 'electron:clean-linux'],
        'electron:create-package-json',
        'electron:build-apps',
        done
    );
});

gulp.task('electron-build-windows', done => {
    runSequence(
        'dev-build',
        'electron:clean-windows',
        'electron:create-package-json',
        'electron:build-windows',
        done
    );
});

gulp.task('electron-build-macos', done => {
    runSequence(
        'dev-build',
        'electron:clean-macos',
        'electron:create-package-json',
        'electron:build-macos',
        done
    );
});

gulp.task('electron-build-linux', done => {
    runSequence(
        'dev-build',
        'electron:clean-linux',
        'electron:create-package-json',
        'electron:build-linux',
        done
    );
});
