import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Quote} from '../../models/quote';
import {QuoteService} from '../../services/quoteService';
import {NotificationService} from '../../services/notificationService';

@Component({
    moduleId: __moduleName,
    selector: 'add-quote',
    templateUrl: 'add.html'
})
export class AddComponent {
    public newQuote: Quote;

    constructor(private _quoteService: QuoteService, private _router: Router, private _notificationService: NotificationService) {
        this.newQuote = new Quote();
    }

    public save() {
        this._quoteService.add(this.newQuote)
            .subscribe(() => {
                    this._notificationService.success('Zitat erfolgreich hinzugefügt.');
                    this._router.navigate(['/']);
                },
                error => this._notificationService.error('Fehler beim Hinzufügen des Zitats.'));
    }

    public cancel() {
        this._router.navigate(['/']);
    }
}
