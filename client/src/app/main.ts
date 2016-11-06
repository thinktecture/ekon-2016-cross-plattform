import {PlatformService} from './services/platformService';
import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './appModule';

export function bootApp(bootFn: Function) {
    if (PlatformService.isMobile) {
        return document.addEventListener('deviceready', <EventListenerOrEventListenerObject>bootFn);
    }

    bootFn();
}

enableProdMode();

bootApp(() => platformBrowserDynamic().bootstrapModule(AppModule));
