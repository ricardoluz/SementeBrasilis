import { Component, OnInit, ViewChild, ElementRef, COMPILER_OPTIONS, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, Validators, FormGroup, NgForm } from '@angular/forms';

import { Bebida } from '../interfaces/bebida';
import { BebidasService } from './../servicos/bebidas.service';

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

  blnEdicao = false;

  // Teste de parametro.
  tmp = `bebidaForm.controls.grupoProduto.hasError('minlength')`;


  bebidaForm = this.fb.group({
    _id: [''],
    nomeProduto: ['', [Validators.required, Validators.minLength(5)]],
    // grupoProduto: [{value: 'Bebida', disabled: true}, [Validators.required, Validators.minLength(3)]],
    // grupoProduto: ['Bebidas', [Validators.required, Validators.minLength(3)]],
    grupoProduto: ['Bebidas'],    // TODO: Criar a lista de bebidas.
    tipoProduto: ['', [Validators.required, Validators.minLength(3)]],      // TODO: Criar a lista de tipo de produto por Grupo.
    unCompra: [''],     // TODO: Criar a lista de unidades.
    qtdeMinima: [0, [Validators.min(1)]],
    estoque: this.fb.group({
      unEstoque1: [''],
      rlEstoqueCompra1: [0],
      unEstoque2: [''],
      rlEstoqueCompra2: [0],
    }),
    unVenda: [''],
    qtdeVenda: [1, [Validators.min(1)]]
  });


  bebidas: Bebida[] = [];     // FIXME: Acertar a interface de Bebidas, ou verificar um modo de utilizar apenas o formBuilder

  // bebidasTmp$: Observable<Bebida[]>;

  grupoProduto: GrupoProduto[] = [];
  unidadeMedida: UnidadeMedida[] = [];
  tipoProduto: TipoProduto[] = [];

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    private bebidaService: BebidasService,
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

    this.bebidaService.get()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (retorno) => { this.bebidas = retorno; },
        (err) => { console.log(err); }
      );

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSubmit() {
    // console.log('save_v02 - 01t');
    if (this.blnEdicao) {
      this.bebidaService.update_v02(this.bebidaForm.value)
        .subscribe(

          success => {

            const i = this.bebidas.findIndex(d2 => {
              return d2._id === success._id;
            });
            if (i >= 0) {
              this.bebidas[i] = success;
            }

            const notifyTmp = success.nomeProduto + ' - Alterada.';
            this.notify(notifyTmp);

            this.clearFields();
            this.blnEdicao = false;
          },

          error => {
            this.notify('Erro ao alterar : ' + this.bebidaForm.get('nomeProduto').value);
            console.error(error.mensage);
          }
        );

    } else {

      this.bebidaService.add(this.bebidaForm.value)
        .pipe(
          takeUntil(this.unsubscribe$)
        )
        .subscribe(

          sucess => {
            this.bebidas.push(sucess);
            const notifyTmp = sucess.nomeProduto + ' - Inserida.';
            this.notify(notifyTmp);

            this.clearFields();
            this.blnEdicao = false;
          },

          error => {
            this.notify('Erro ao adicionar : ' + this.bebidaForm.get('nomeProduto').value);
            console.error(error.mensage);
          }
        );
    }
  }

  edit(prmEdicao: Bebida) {
    this.blnEdicao = true;
    // console.log(prmEdicao);
    this.bebidaForm.patchValue(prmEdicao);
    this.frmPosicaoInicial.nativeElement.focus();
  }


  delete(beb: Bebida) {

    // TODO: Limpar o formulário caso o produto editado seja apagado.
    // this.clearFields();

    this.bebidaService.del(beb)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(

        sucess => {
          this.notify(beb.nomeProduto + ' - foi apagada.');

          const i = this.bebidas.findIndex(d2 => {
            return d2._id === beb._id;
          });
          if (i >= 0) {
            this.bebidas.splice(i, 1);
          }

        },

        error => {
          this.notify('Erro ao apagar : ' + beb.nomeProduto);
          console.log(error.message);
        }
      );

    // this.blnEdicao = false;
  }

  clearFields() {

    this.blnEdicao = false;

    this.frmPosicaoInicial.nativeElement.focus();

    this.bebidaForm.reset();
    this.formDirective.resetForm();

  }

  notify(msg: string) {
    this.snackBar.open(msg, 'OK', { duration: 3000 });
  }

}
