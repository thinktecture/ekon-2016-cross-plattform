import {Injectable, Component, OnInit} from '@angular/core';
import {NotificationService} from '../../services/notificationService';
import {Notification} from '../../models/notification';
import {NotificationType} from '../../models/notificationType';

@Component({
    moduleId: __moduleName,
    selector: 'notification',
    templateUrl: 'notification.html'
})
@Injectable()
export class NotificationComponent implements OnInit {
    public notification: Notification;
    public NotificationType = NotificationType;

    constructor(private _notificationService: NotificationService) {

    }

    public ngOnInit(): void {
        this._notificationService.notified
            .subscribe(notification => {
                this.notification = notification;
                setTimeout(() => this.notification = null, 5000)
            });
    }


}
