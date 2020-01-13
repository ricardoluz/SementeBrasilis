import { Component, OnInit, ViewChild, ElementRef, COMPILER_OPTIONS, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, Validators, FormGroup, NgForm } from '@angular/forms';

import { Bebida } from '../interfaces/bebida';
import { BebidasService } from './../servicos/bebidas.service';

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

  // blnEdicao = false;


  bebidaForm = this.fb.group({});

  // bebidas: Bebida[] = [];     // FIXME: Acertar a interface de Bebidas, ou verificar um modo de utilizar apenas o formBuilder

  produtos$: Observable<Produto[]>;
  filterProducts$: Observable<Produto[]>;
  // bebidasTmp$: Observable<Bebida[]>;

  grupoProduto: GrupoProduto[] = [];
  unidadeMedida: UnidadeMedida[] = [];
  tipoProduto: TipoProduto[] = [];

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    private bebidaService: BebidasService,
    private produtoService: ProdutoService,
    private grupoProdutoService: GrupoProdutoService,
    private tipoProdutoService: TipoProdutoService,
    private unidadeMedidaService: UnidadeMedidaService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {

    // TODO: Rever a necessidade para limpar os valores.
    this.grupoProduto = this.grupoProdutoService.get();
    this.tipoProduto = this.tipoProdutoService.get();
    this.unidadeMedida = this.unidadeMedidaService.get();

    // this.bebidaService.get()
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe(
    //     (retorno) => { this.bebidas = retorno; },
    //     (err) => { console.log(err); }
    //   );

    this.montarFormulario();
    this.produtos$ = this.produtoService.getProdutos();


  }

  montarFormulario() {
    this.bebidaForm = this.fb.group({
      _id: [''],      // TODO: remover em breve
      id: [undefined],
      nomeProduto: ['', [Validators.required, Validators.minLength(5)]],
      grupoProduto: ['Bebidas'],
      tipoProduto: ['', [Validators.required, Validators.minLength(3)]],
      unCompra: ['', [Validators.required]],
      qtdeMinima: [0, [Validators.min(1)]],
      estoque: this.fb.group({
        unEstoque1: ['', [Validators.required]],
        rlEstoqueCompra1: [0, [Validators.min(1)]],
        unEstoque2: [''],
        rlEstoqueCompra2: [0, [Validators.min(0)]],
      }),
      unVenda: [''],
      qtdeVenda: [1, [Validators.min(1)]]
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
        this.snackBar.open('Produto adicionado.', 'OK', { duration: 2000 });
        this.clearFields();
      })
      .catch(() => {
        this.snackBar.open('Error on submiting the product.', 'OK', { duration: 2000 });
      });
  }

  updateProduct(p: Produto) {
    this.produtoService.updateProduct(p)
      .then(() => {
        this.snackBar.open('Produto atualizado', 'OK', { duration: 2000 });
        this.clearFields();
      })
      .catch((e) => {
        console.log(e);
        this.snackBar.open('Error updating the product', 'OK', { duration: 2000 });
      });

  }


  edit(p: Produto) {
    this.bebidaForm.setValue(p);
  }

  delete(p: Produto) {
    this.produtoService.deleteProduct(p)
      .then(() => {
        this.snackBar.open('Produto removido', 'OK', { duration: 2000 });
      })
      .catch((e) => {
        console.log(e);
        this.snackBar.open('Error when trying to remove the product', 'OK', { duration: 2000 });
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

  // edit_old_2020_01_12(prmEdicao: Bebida) {
  //   this.blnEdicao = true;
  //   // console.log(prmEdicao);
  //   this.bebidaForm.patchValue(prmEdicao);
  //   this.frmPosicaoInicial.nativeElement.focus();
  // }


  // delete_old_2020_01_12(beb: Bebida) {

  //   // TODO: Limpar o formulário caso o produto editado seja apagado.
  //   // this.clearFields();

  //   this.bebidaService.del(beb)
  //     .pipe(
  //       takeUntil(this.unsubscribe$)
  //     )
  //     .subscribe(

  //       sucess => {
  //         this.notify(beb.nomeProduto + ' - foi apagada.');

  //         const i = this.bebidas.findIndex(d2 => {
  //           return d2._id === beb._id;
  //         });
  //         if (i >= 0) {
  //           this.bebidas.splice(i, 1);
  //         }

  //       },

  //       error => {
  //         this.notify('Erro ao apagar : ' + beb.nomeProduto);
  //         console.log(error.message);
  //       }
  //     );

  //   // this.blnEdicao = false;
  // }

  clearFields() {

    // this.blnEdicao = false;

    this.frmPosicaoInicial.nativeElement.focus();

    // this.bebidaForm.reset();
    this.montarFormulario();
    this.formDirective.resetForm();

  }

  notify(msg: string) {
    this.snackBar.open(msg, 'OK', { duration: 3000 });
  }

}
