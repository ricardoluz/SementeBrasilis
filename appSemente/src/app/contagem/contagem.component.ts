import { Component, OnInit } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

import { Bebida } from './../interfaces/bebida';
import { BebidasService } from '../servicos/bebidas.service';
import { Contagem } from '../interfaces/contagem';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ContagemService } from '../servicos/contagem.service';
import { MatSnackBar } from '@angular/material';


import { DatePipe } from '@angular/common';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-contagem',
  templateUrl: './contagem.component.html',
  styleUrls: ['./contagem.component.css']
})


export class ContagemComponent implements OnInit {

  contagemForm: FormGroup;

  private snackBar: MatSnackBar;
  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    private bebidaService: BebidasService,
    private contagemService: ContagemService,

    private formBuilder: FormBuilder,
    private dataPipe: DatePipe
  ) { }

  ngOnInit() {

    this.criarFormContagem();

  }

  criarFormContagem() {

    this.contagemForm = this.formBuilder.group({
      dataContagem: new Date().toISOString(),
      linhaProduto: this.formBuilder.array([])
    });

    const control: FormArray = this.contagemForm.get(`linhaProduto`) as FormArray;

    this.bebidaService.get()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (prods) => {

          if (prods) {

            for (const tmp of prods) {
              control.push(this.addEqp_v01(tmp));
            }

            console.log(this.contagemForm);
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  addEqp_v01(prod: Bebida) {
    const group = this.formBuilder.group({
      nomeProduto: [prod.nomeProduto],
      q1: [0, Validators.min(0)],
      un1: [prod.estoque.unEstoque1],
      rel1: [prod.estoque.rlEstoqueCompra1],
      q2: [0, Validators.min(0)],
      un2: [prod.estoque.unEstoque2],
      rel2: [prod.estoque.rlEstoqueCompra2],
      unCompra: [prod.unCompra],
      qMinima: [prod.qtdeMinima],
      qTotal: [0]
    });
    return group;
  }


  // save() {
  //   console.log('save_v02 - 01t');
  //   if (this.blnEdicao) {
  //     this.bebidaService.update(this.bebidaForm.value)
  //       .subscribe(
  //         (dep) => {
  //           const notifyTmp = dep.nomeProduto + ' - Alterada.';
  //           this.notify(notifyTmp);
  //         },
  //         (err) => {
  //           this.notify('Error');
  //           console.error(err);
  //         }
  //       );
  //   } else {
  //     this.bebidaService.add(this.bebidaForm.value)
  //       .subscribe(
  //         (dep) => {
  //           console.log(dep);
  //           const notifyTmp = dep.nomeProduto + ' - Inserida.';
  //           this.notify(notifyTmp);
  //         },
  //         (err) => console.error(err));
  //   }

  //   this.clearFields();
  //   this.blnEdicao = false;
  // }

  salvarContagem() {

    // Atualizar a quantidade Total no formBuilder.
    for (const iterator of this.contagemForm.get('linhaProduto').value) {
      console.log(iterator);
      console.log(iterator.q1 / iterator.rel1 + iterator.q2 / iterator.rel2);
      iterator.qTotal = this.arred(iterator.q1 / iterator.rel1 + iterator.q2 / iterator.rel2, 2);
    }


    // Criar um objeto Contagem a partir do FormBuilder
    const contagemGravavao: Contagem = Object.assign({}, this.contagemForm.value);


    // Gravar a contagem
    this.contagemService.add(contagemGravavao)
      .subscribe(
        (dep) => {
          console.log(dep);
          // const notifyTmp = dep.dataContagem + ' - Inserida.';
          // const notifyTmp = 'Contagem inserida.';
          // this.notify('aaaa');
        },
        (err) => console.error(err));

  }


  notify(msg: string) {
    this.snackBar.open(msg, 'OK', { duration: 3000 });
  }

  arred(numero: number, numCasaDecimais: number) {
    let numTmp = numero * Math.pow(10, numCasaDecimais);
    numTmp = Math.round(numTmp) / Math.pow(10, numCasaDecimais);
    return numTmp;
  }


  // FIXME: Rever a passagem por esta função
  // tslint:disable-next-line: use-lifecycle-interface
  // ngOnDestroy(): void {
  //   console.warn('OnDestroy - contagem');
  //   this.unsubscribe$.next();
  //   this.unsubscribe$.complete();
  //   console.warn('OnDestroy executado');
  // }

}
