import {Component} from '@angular/core';
import {DesktopService} from '../../services/desktopService';

@Component({
    moduleId: __moduleName,
    selector: 'app-root',
    templateUrl: 'root.html'
})
export class RootComponent {
    constructor(private _desktopService: DesktopService) {
        this._desktopService.integrate();
    }
}
