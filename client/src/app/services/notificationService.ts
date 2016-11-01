import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Notification} from '../models/notification';
import {NotificationType} from '../models/notificationType';
import {Injectable} from '@angular/core';

@Injectable()
export class NotificationService {

    public notified: BehaviorSubject<Notification> = new BehaviorSubject<Notification>(null);

    public success(message: string) {
        let notification = new Notification();
        notification.message = message;
        notification.type = NotificationType.success;

        this.notified.next(notification)
    }

    public error(message: string) {
        let notification = new Notification();
        notification.message = message;
        notification.type = NotificationType.error;

        this.notified.next(notification);
    }
}
