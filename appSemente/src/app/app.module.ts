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
import { AngularFireModule} from '@angular/fire';
import { AngularFireDatabaseModule} from '@angular/fire/database';
import { AngularFirestoreModule} from '@angular/fire/firestore';

import { PedidoComponent } from './pedido/pedido.component';
import { ContagemListaComponent } from './contagem-lista/contagem-lista.component';
import { PedidoApresentacaoComponent } from './pedido/pedido-apresentacao/pedido-apresentacao.component';
// import { from } from 'rxjs';

import { environment } from 'src/environments/environment';
import { TesteComponent } from './teste/teste.component';
import { ListaPedidoComponent } from './pedido/lista-pedido/lista-pedido.component';
import { GrupoProdutoRegistroComponent } from './apoio/grupo-produto-registro/grupo-produto-registro.component';
import { ApoioComponent } from './apoio/apoio.component';
import { TipoProdutoRegistroComponent } from './apoio/tipo-produto-registro/tipo-produto-registro.component';
import { UploadArquivosComponent } from './upload-arquivos/upload-arquivos.component';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { DownloadArquivosComponent } from './download-arquivos/download-arquivos.component';



@NgModule({
  declarations: [
    AppComponent,
    BebidasFormComponent,
    ContagemComponent,
    RoutesComponent,
    PageNotFoundComponent,
    PedidoComponent,
    ContagemListaComponent,
    PedidoApresentacaoComponent,
    TesteComponent,
    ListaPedidoComponent,
    GrupoProdutoRegistroComponent,
    ApoioComponent,
    TipoProdutoRegistroComponent,
    UploadArquivosComponent,
    DownloadArquivosComponent,
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
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
