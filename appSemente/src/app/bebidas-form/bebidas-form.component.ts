import { NotificacaoService } from './../servicos/utilidades/notificacao.service';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
// import { MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup, NgForm } from '@angular/forms';

import { Produto } from '../interfaces/produto';
import { ProdutoService } from './../servicos/produto.service';

import { GrupoProduto } from '../interfaces/grupo-produto';
import { GrupoProdutoService } from './../servicos/grupo-produto.service';

import { UnidadeMedida } from '../interfaces/unidade-medida';
import { UnidadeMedidaService } from './../servicos/unidade-medida.service';

import { TipoProduto } from './../interfaces/tipo-produto';
import { TipoProdutoService } from './../servicos/tipo-produto.service';

@Component({
  selector: 'app-bebidas-form',
  templateUrl: './bebidas-form.component.html',
  styleUrls: ['./bebidas-form.component.css']
})

export class BebidasFormComponent implements OnInit, OnDestroy {

  @ViewChild('formDirective', { static: false }) private formDirective: NgForm;
  @ViewChild('posicaoInicial', { static: false }) private frmPosicaoInicial: ElementRef;


  bebidaForm = this.fb.group({});

  // bebidas: Bebida[] = [];     // FIXME: Acertar a interface de Bebidas, ou verificar um modo de utilizar apenas o formBuilder

  produtos$: Observable<Produto[]>;
  filterProducts$: Observable<Produto[]>;


  grupoProduto$: Observable<GrupoProduto[]>;
  tipoProduto$: Observable<TipoProduto[]>;

  unidadeMedida: UnidadeMedida[] = [];

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    private produtoService: ProdutoService,
    private grupoProdutoService: GrupoProdutoService,
    private tipoProdutoService: TipoProdutoService,
    private unidadeMedidaService: UnidadeMedidaService,
    private notificacaoService: NotificacaoService,
    private fb: FormBuilder,
    // private snackBar: MatSnackBar
  ) { }

  ngOnInit() {

    // TODO: Criar uma tabela para as unidades de medida.
    this.unidadeMedida = this.unidadeMedidaService.get();

    this.montarFormulario();
    this.grupoProduto$ = this.grupoProdutoService.getGrupoProdutos();
    this.tipoProduto$ = this.tipoProdutoService.getTipoProdutos_v01('');
    this.produtos$ = this.produtoService.getProdutos();
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  montarFormulario() {
    this.bebidaForm = this.fb.group({
      _id: [''],      // TODO: remover em breve
      id: [undefined],
      nomeProduto: ['', [Validators.required, Validators.minLength(5)]],
      grupoProduto: ['', [Validators.required]],
      tipoProduto: ['', [Validators.required, Validators.minLength(3)]],
      unCompra: ['', [Validators.required]],
      qtdeMinima: [1, [Validators.min(1)]],
      precoCompra: [1.00, [Validators.min(0.01)]],
      estoque: this.fb.group({
        unEstoque1: ['', [Validators.required]],
        rlEstoqueCompra1: [0, [Validators.required, Validators.min(0.01)]],
        unEstoque2: [''],
        rlEstoqueCompra2: [0, [Validators.min(0)]],
      }),
      unVenda: [''],
      qtdeVenda: [1, [Validators.min(1)]]
    });
  }

  funSelectGrupoProduto(e: any) {
    this.tipoProduto$ = this.tipoProdutoService.getTipoProdutos_v01(e.value);
  }


  onSubmit() {
    const p: Produto = this.bebidaForm.value;
    if (!p.id) {
      this.addProduct(p);
    } else {
      this.updateProduct(p);
    }
  }

  addProduct(p: Produto) {
    this.produtoService.addProduto(p)
      .then(() => {
        this.notificacaoService.notificacao('Produto adicionado', 2000);
        this.clearFields();
      })
      .catch(() => {
        this.notificacaoService.notificacao('Erro ao adicionar o produto.', 2000);
      });
  }

  updateProduct(p: Produto) {
    this.produtoService.updateProduct(p)
      .then(() => {
        this.notificacaoService.notificacao('Produto atualizado', 2000);
        this.clearFields();
      })
      .catch((e) => {
        console.log(e);
        this.notificacaoService.notificacao('Erro ao atualizar o produto.', 2000);
      });

  }


  edit(p: Produto) {
    this.bebidaForm.patchValue(p);
  }


  delete(p: Produto) {
    this.produtoService.deleteProduct(p)
      .then(() => {
        this.notificacaoService.notificacao('Produto removido', 2000);
      })
      .catch((e) => {
        console.log(e);
        this.notificacaoService.notificacao('Erro ao remover o produto', 2000);
      });
  }

  // filter(event) {
  //   this.filterProducts$ = this.produtoService.searchByName(event.target.value);
  // }

  // onSubmit_old_2020_01_12() {
  //   // console.log('save_v02 - 01t');
  //   if (this.blnEdicao) {
  //     this.bebidaService.update_v02(this.bebidaForm.value)
  //       .subscribe(

  //         success => {

  //           const i = this.bebidas.findIndex(d2 => {
  //             return d2._id === success._id;
  //           });
  //           if (i >= 0) {
  //             this.bebidas[i] = success;
  //           }

  //           const notifyTmp = success.nomeProduto + ' - Alterada.';
  //           this.notify(notifyTmp);

  //           this.clearFields();
  //           this.blnEdicao = false;
  //         },

  //         error => {
  //           this.notify('Erro ao alterar : ' + this.bebidaForm.get('nomeProduto').value);
  //           console.error(error.mensage);
  //         }
  //       );

  //   } else {

  //     this.bebidaService.add(this.bebidaForm.value)
  //       .pipe(
  //         takeUntil(this.unsubscribe$)
  //       )
  //       .subscribe(

  //         sucess => {
  //           this.bebidas.push(sucess);
  //           const notifyTmp = sucess.nomeProduto + ' - Inserida.';
  //           this.notify(notifyTmp);

  //           this.clearFields();
  //           this.blnEdicao = false;
  //         },

  //         error => {
  //           this.notify('Erro ao adicionar : ' + this.bebidaForm.get('nomeProduto').value);
  //           console.error(error.mensage);
  //         }
  //       );
  //   }
  // }



  clearFields() {

    // this.blnEdicao = false;

    this.frmPosicaoInicial.nativeElement.focus();

    // this.bebidaForm.reset();
    this.montarFormulario();
    this.formDirective.resetForm();

  }

  // notify(msg: string) {
  //   this.snackBar.open(msg, 'OK', { duration: 3000 });
  // }

}
