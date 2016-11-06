import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {PlatformService} from './platformService';

declare var window: any;

@Injectable()
export class DesktopService {
    constructor(private _router: Router,
                private _platformService: PlatformService) {
    }

    public integrate() {
        if (this._platformService.isDesktop) {
            // systemJS is trying to require electron if you call it without explicitly calling it on window
            window.require('electron').ipcRenderer.on('navigateTo', (event, data) => {
                this._router.navigate([data]);
            });
        }
    }
}
