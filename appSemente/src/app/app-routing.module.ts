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
import { ListaPedidoComponent } from './pedido/lista-pedido/lista-pedido.component';
import { ApoioComponent } from './apoio/apoio.component';
import { GrupoProdutoRegistroComponent } from './apoio/grupo-produto-registro/grupo-produto-registro.component';
import { TipoProdutoRegistroComponent } from './apoio/tipo-produto-registro/tipo-produto-registro.component';
import { UploadArquivosComponent } from './upload-arquivos/upload-arquivos.component';
import { DownloadArquivosComponent } from './download-arquivos/download-arquivos.component';
// import { TesteComponent } from './teste/teste.component';


const appRoutes: Routes = [

  { path: 'inicial', component: RoutesComponent },
  { path: 'apoio', component: ApoioComponent },
  { path: 'apoio/grupoProduto', component: GrupoProdutoRegistroComponent },
  { path: 'apoio/tipoProduto', component: TipoProdutoRegistroComponent },

  // { path: 'teste', component: TesteComponent },
  { path: 'produtos', component: BebidasFormComponent },
  { path: 'contagem', component: ContagemComponent },
  { path: 'listaContagem', component: ContagemListaComponent },
  { path: 'listaPedido', component: ListaPedidoComponent },
  { path: 'pedido/:id', component: PedidoComponent },
  { path: 'pedidoApresentacao/:id', component: PedidoApresentacaoComponent },

  { path: 'uploadArquivo', component: UploadArquivosComponent },
  { path: 'downloadArquivo', component: DownloadArquivosComponent },

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
