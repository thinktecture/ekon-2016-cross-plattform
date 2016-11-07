import {Routes, RouterModule} from '@angular/router';
import {RandomComponent} from './components/random/random';
import {ListComponent} from './components/list/list';
import {AddComponent} from './components/add/add';

const appRoutes: Routes = [
    {
        path: '',
        component: RandomComponent,
        pathMatch: 'full'
    },
    {
        path: 'list',
        component: ListComponent,
    },
    {
        path: 'add',
        component: AddComponent
    }
];

export const AppRoutes = RouterModule.forRoot(appRoutes, {
    useHash: true
});

export const appRoutingProviders: any[] = [];
