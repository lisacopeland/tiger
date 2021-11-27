import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableModule } from 'primeng/table';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { moviesReducer } from './+store/movies.reducers';
import { MoviesEffects } from './+store/movies.effects';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    TableModule,
    StoreModule.forRoot({ movies: moviesReducer }),
    EffectsModule.forRoot([MoviesEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
