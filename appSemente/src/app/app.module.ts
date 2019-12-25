import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';

import { MAT_DATE_LOCALE } from '@angular/material';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt, 'pt-BR');

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

import { DatePipe } from '@angular/common';

import { BebidasFormComponent } from './bebidas-form/bebidas-form.component';
import { ContagemComponent } from './contagem/contagem.component';
import { RoutesComponent } from './testes/routes/routes.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { AppRoutingModule } from './app-routing.module';

import { Routes2Component } from './testes/routes2/routes2.component';
import { UsoObservableComponent } from './testes/uso-observable/uso-observable.component';
import { PedidoComponent } from './pedido/pedido.component';
import { ContagemListaComponent } from './contagem-lista/contagem-lista.component';


@NgModule({
  declarations: [
    AppComponent,
    BebidasFormComponent,
    ContagemComponent,
    // UsoObservableComponent,
    RoutesComponent,
    // Routes2Component,
    PageNotFoundComponent,
    PedidoComponent,
    ContagemListaComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
