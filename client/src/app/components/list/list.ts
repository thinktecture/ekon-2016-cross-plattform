import {Component, OnInit} from '@angular/core';
import {QuoteService} from '../../services/quoteService';
import {Quote} from '../../models/quote';
import {NotificationService} from '../../services/notificationService';

@Component({
    moduleId: __moduleName,
    selector: 'quote-list',
    templateUrl: 'list.html'
})
export class ListComponent implements OnInit {
    public quotes: Array<Quote>;

    constructor(private _quoteService: QuoteService, private _notificationService: NotificationService) {

    }

    public ngOnInit() {
        this.loadQuotes();
    }

    private loadQuotes() {
        this._quoteService.list()
            .subscribe(quotes => this.quotes = quotes, error => {
                console.log(error);
                this._notificationService.error('Fehler beim Laden der Zitate.')
            });
    }

    public delete(quote: Quote): void {
        this._quoteService.delete(quote)
            .subscribe(() => {
                    this._notificationService.success('Zitat erfolgreich gelöscht.')
                    this.loadQuotes();
                },
                error => {
                    console.log(error);
                    this._notificationService.error('Zitat konnte nicht gelöscht werden.');
                }
    }

);
}
}
