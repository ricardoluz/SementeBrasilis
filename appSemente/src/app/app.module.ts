import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

import { Routes, RouterModule } from '@angular/router';
// import {PageNotFoundComponent} from 'a'

import { DatePipe } from '@angular/common';

import { BebidasFormComponent } from './bebidas-form/bebidas-form.component';
import { ContagemComponent } from './contagem/contagem.component';
import { RoutesComponent } from './testes/routes/routes.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { AppRoutingModule } from './app-routing.module';

import { Routes2Component } from './testes/routes2/routes2.component';
import { UsoObservableComponent } from './testes/uso-observable/uso-observable.component';
import { MAT_DATE_LOCALE } from '@angular/material';
import { PedidoComponent } from './pedido/pedido.component';
import { ContagemListaComponent } from './contagem-lista/contagem-lista.component';

// const appRoutes: Routes = [

//   { path: 'inicial', component: RoutesComponent },
//   { path: 'produtos', component: BebidasFormComponent },
//   { path: 'contagem', component: ContagemComponent },
//   { path: '', pathMatch: 'full', redirectTo: 'inicial' },
//   { path: '**', component: PageNotFoundComponent }
// ];

@NgModule({
  declarations: [
    AppComponent,
    BebidasFormComponent,
    ContagemComponent,
    // AppRoutingModule
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
    // RouterModule.forRoot(appRoutes),
    AppRoutingModule,
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
