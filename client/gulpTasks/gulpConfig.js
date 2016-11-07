'use strict';

const path = require('path');

const currentPackage = require('../package.json');

const config = {
    name: 'EKON 20 - Quotes',
    module: currentPackage.name,
    version: currentPackage.version,
    base: 'src',
    index: 'src/index.html',
    systemJs: 'src/systemSetup.js',
    sources: {
        scripts: [
            'src/**/*.ts',
            '!src/**/main.aot.ts'
        ],
        templates: [
            'src/**/*.html'
        ],
        styles: {
            all: ['src/less/**/*.less'],
            main: [
                'src/less/app.less'
            ]
        },
        assets: [
            'src/assets/**/*'
        ],
        i18n: [
            'src/i18n/*.json'
        ],
        buildAssets: {
            cordovaJs: 'resources/cordova/cordova.js',
            buildJson: 'resources/cordova/build.json',
            config: 'resources/cordova/config.xml',
            hooks: 'resources/cordova/hooks/**/*',
            configLiveReload: 'resources/cordova/config_livereload.xml',
            electron: 'resources/electron/**/*',
            icons: 'resources/icons/*',
            iconsFolder: 'resources/icons'
        },
        fonts: [
            'src/assets/**/*',
            'node_modules/materialize-css/dist/fonts/**/*'
        ]
    },
    targets: {
        build: 'build',
        lib: 'build/lib',
        fonts: 'build/fonts',
        assets: 'build/assets',
        cordova: 'dist/mobile',
        electron: 'dist/desktop',
        dist: {
            web: 'dist/web'
        }
    },
    typescript: {
        dev: {
            target: 'ES5',
            module: 'system',
            moduleResolution: 'node',
            declaration: false,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            removeComments: false,
            noImplicitAny: false
        },
        dist: {
            target: 'es5',
            allowJs: true
        }
    },
    browsers: ['IE >= 11', 'last 2 versions'],
    browserSync: {
        // Turn off cross-device sync features
        ghostMode: false,
        open: true,
        server: {
            baseDir: './build',
            middleware: {}
        },
        port: 8000
    },
    vendorScripts: [
        'node_modules/core-js/client/shim.js',
        'node_modules/zone.js/dist/zone.js',
        'node_modules/reflect-metadata/Reflect.js',
        'node_modules/systemjs/dist/system.src.js',
        'node_modules/hammerjs/hammer.js'
    ],
    bundles: [
        'rxjs/Rx.js'
    ],
    devScripts: [
        'node_modules/zone.js/dist/long-stack-trace-zone.js'
    ],
    nodeModules: [
        '@angular',
        'oidc-client',
        'ng2-translate',
        'moment'
    ],
    oidcScript: 'node_modules/oidc-client/dist/oidc-client.js'
};

config.injectables = [
    ...config.vendorScripts.map(v => path.join(config.targets.lib, v.split('/').slice(-1)[0])),
    ...config.bundles.map(v => path.join(config.targets.lib, v)),
    ...config.devScripts.map(v => path.join(config.targets.lib, v.split('/').slice(-1)[0])),
    path.join(config.targets.build, config.systemJs.split('/').slice(-1)[0]),
    path.join(config.targets.build, '**/*.css')
];

module.exports = config;
