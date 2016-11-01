import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Quote} from '../models/quote';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import 'rxjs/Rx';

@Injectable()
export class QuoteService {
    private _apiUrl: string;
    private _defaultTimeout: number;

    constructor(private _http: Http) {
        //this._apiUrl = 'http://10.211.55.20:20000/relay/link/delphi';
        this._apiUrl = 'http://10.211.55.19:8000';
        this._defaultTimeout = 5000;
    }

    private getEndpoint(method: string) {
        return `${this._apiUrl}/${method}`;
    }

    public random(): Observable<Quote> {
        return this._http.get(this.getEndpoint('random'))
            .timeout(this._defaultTimeout)
            .map(response => response.json())
            .map(json => Quote.deserialize(json));
    }

    public list(): Observable<Array<Quote>> {
        return this._http.get(this.getEndpoint('list'))
            .timeout(this._defaultTimeout)
            .flatMap(response => Observable.from(response.json()))
            .map(json => Quote.deserialize(json))
            .toArray();
    }

    public add(quote: Quote): Observable<any> {
        return this._http.post(this.getEndpoint('add'), JSON.stringify(quote.serialize()))
            .timeout(this._defaultTimeout)
            .map(response => response.json())
            .map(response => response.id);
    }

    public delete(quote: Quote): Observable<void> {
        return this._http.delete(this.getEndpoint(`delete/${quote.id}`))
            .timeout(this._defaultTimeout)
            .map(response => response.json());
    }
}
