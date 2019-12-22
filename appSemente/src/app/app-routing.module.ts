import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { RoutesComponent } from './testes/routes/routes.component';
import { BebidasFormComponent } from './bebidas-form/bebidas-form.component';
import { ContagemComponent } from './contagem/contagem.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const appRoutes: Routes = [

  { path: 'inicial', component: RoutesComponent },
  { path: 'produtos', component: BebidasFormComponent },
  { path: 'contagem', component: ContagemComponent },
  { path: '', pathMatch: 'full', redirectTo: 'inicial' },
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
