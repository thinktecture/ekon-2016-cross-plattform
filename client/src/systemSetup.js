(function (global) {
    // If process is present, we are running through this code via gulp and try to compile it.
    var npmPath = 'lib/';

    var angularPackages = [
        '@angular/core',
        '@angular/common',
        '@angular/compiler',
        '@angular/platform-browser',
        '@angular/http',
        '@angular/router',
        '@angular/forms',
        '@angular/platform-browser-dynamic'
    ];

    var mapConfig = {};
    var packagesConfig = {
        app: {
            main: 'main',
            defaultExtension: 'js'
        }
    };

    angularPackages.forEach(function (p) {
        var name = p.split('/');
        var mappedName = 'npm:' + p;

        mappedName += '/bundles/' + name[1] + '.umd.js';

        mapConfig[p] = mappedName;
    });

    var systemConfig = {
        paths: {
            'npm:': npmPath
        },
        map: mapConfig,
        packages: packagesConfig
    };

    System.config(systemConfig);

    System.import('app')
        .catch(console.error.bind(console));
})(this);
