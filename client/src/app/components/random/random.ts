import {Component, OnInit, Injectable} from '@angular/core';
import {QuoteService} from '../../services/quoteService';
import {Quote} from '../../models/quote';
import {NotificationService} from '../../services/notificationService';

@Component({
    moduleId: __moduleName,
    selector: 'random',
    templateUrl: 'random.html'
})
export class RandomComponent implements OnInit {
    public quote: Quote;


    constructor(private _quoteService: QuoteService, private _notificationService: NotificationService) {
    }

    public ngOnInit() {
        this._quoteService.random()
            .subscribe(quote => this.quote = quote, error => {
                console.log(error);
                this._notificationService.error('Fehler beim Laden des Zitats.');
            });
    }
}
