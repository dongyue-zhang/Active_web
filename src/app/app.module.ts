import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Store, StoreModule } from '@ngrx/store';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NavbarComponent } from './navbar/navbar.component';
import { EffectsModule } from '@ngrx/effects';
import { Effects } from './store/effects';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { appReducer } from './store/reducer';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgToastModule } from 'ng-angular-popup';

@NgModule({
    declarations: [
        AppComponent,
        FooterComponent
    ],
    bootstrap: [AppComponent],
    imports: [
        NgToastModule,
        MatProgressSpinnerModule,
        MatIconModule,
        BrowserModule,
        AppRoutingModule,
        StoreModule.forRoot(appReducer),
        NavbarComponent,
        EffectsModule.forRoot([Effects]),
        StoreDevtoolsModule.instrument({ logOnly: environment.production }),
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        })],
    providers: [
        provideAnimationsAsync(),
        {
            provide: DATE_PIPE_DEFAULT_OPTIONS,
            useValue: { dateFormat: "longDate" }
        },
        provideHttpClient(withInterceptorsFromDi()),
    ]
})
export class AppModule {



}
