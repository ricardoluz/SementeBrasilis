import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { RoutesComponent } from './testes/routes/routes.component';
import { BebidasFormComponent } from './bebidas-form/bebidas-form.component';
import { ContagemComponent } from './contagem/contagem.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PedidoComponent } from './pedido/pedido.component';
import { ContagemListaComponent } from './contagem-lista/contagem-lista.component';
import { PedidoApresentacaoComponent } from './pedido/pedido-apresentacao/pedido-apresentacao.component';


const appRoutes: Routes = [

  { path: 'inicial', component: RoutesComponent },
  { path: 'produtos', component: BebidasFormComponent },
  { path: 'contagem', component: ContagemComponent },
  { path: 'listaContagem', component: ContagemListaComponent },
  { path: 'pedido/:id', component: PedidoComponent },
  { path: 'pedidoApresentacao/:id', component: PedidoApresentacaoComponent },
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
