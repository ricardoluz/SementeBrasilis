import { Component, OnInit, ViewChild, ElementRef, COMPILER_OPTIONS, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { takeUntil, tap } from 'rxjs/operators';
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

    this.grupoProduto = this.grupoProdutoService.get();
    this.tipoProduto = this.tipoProdutoService.get();
    this.unidadeMedida = this.unidadeMedidaService.get();

    this.bebidaService.get_v02()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (retorno) => { this.bebidas = retorno; },
        (err) => { console.log(err); }
      );

    // this.bebidasTmp$ = this.bebidaService.bebidas$;

  }

  ngOnDestroy() {
    console.warn('OnDestroy - bebidas-form');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    console.warn('OnDestroy executado');
  }

  onSubmit() {
    // console.log('OnSubmit');
    // console.log(this.bebidaForm.get('nomeProduto').value);
    this.save();
  }

  save() {
    console.log('save_v02 - 01t');
    if (this.blnEdicao) {
      this.bebidaService.update_v02(this.bebidaForm.value)
        .pipe(
          tap((d: Bebida) => {
            console.log(d);
            const i = this.bebidas.findIndex(d2 => {
              return d2._id === d._id;
            });
            if (i >= 0) {
              // bebidas[i].nomeProduto = d.nomeProduto;
              this.bebidas[i] = d;
            }
          })
        )
        .subscribe(
          (dep) => {
            const notifyTmp = dep.nomeProduto + ' - Alterada.';
            this.notify(notifyTmp);
          },
          (err) => {
            this.notify('Error');
            console.error(err);
          }
        );
    } else {
      this.bebidaService.add(this.bebidaForm.value)
        .subscribe(
          (dep) => {
            console.log(dep);
            const notifyTmp = dep.nomeProduto + ' - Inserida.';
            this.notify(notifyTmp);
          },
          (err) => console.error(err));
    }

    this.clearFields();
    this.blnEdicao = false;
  }

  edit(prmEdicao: Bebida) {
    this.blnEdicao = true;
    console.log(prmEdicao);
    this.bebidaForm.patchValue(prmEdicao);
    this.frmPosicaoInicial.nativeElement.focus();
  }


  delete(beb: Bebida) {

    // this.clearFields();

    this.bebidaService.del(beb)
      .subscribe(
        () => this.notify(beb.nomeProduto + ' - foi apagada.'),
        (err) => this.notify(err.error.msg)
      );

    // this.blnEdicao = false;
  }

  clearFields() {

    console.log('clearFields_p01');
    this.blnEdicao = false;

    this.frmPosicaoInicial.nativeElement.focus();

    this.bebidaForm.reset();
    this.formDirective.resetForm();

  }

  notify(msg: string) {
    this.snackBar.open(msg, 'OK', { duration: 3000 });
  }

}
