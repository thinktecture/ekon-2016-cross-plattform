import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppRoutes, appRoutingProviders} from './routes';
import {RootComponent} from './components/root/root';
import {QuoteService} from './services/quoteService';
import {RandomComponent} from './components/random/random';
import {ListComponent} from './components/list/list';
import {AddComponent} from './components/add/add';
import {InputFieldComponent} from './components/inputField/inputField';
import {NotificationService} from './services/notificationService';
import {NotificationComponent} from './components/notification/notification';
import {PlatformService} from './services/platformService';
import {DesktopService} from './services/desktopService';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutes
    ],
    declarations: [
        RootComponent,
        RandomComponent,
        ListComponent,
        AddComponent,
        InputFieldComponent,
        NotificationComponent
    ],
    bootstrap: [RootComponent],
    providers: [
        appRoutingProviders,
        QuoteService,
        NotificationService,
        PlatformService,
        DesktopService
    ]
})
export class AppModule {

}
