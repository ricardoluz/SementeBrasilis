import { formatDate } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Bebida } from './../interfaces/bebida';
import { BebidasService } from '../servicos/bebidas.service';
import { ContagemService } from '../servicos/contagem.service';


@Component({
  selector: 'app-contagem',
  templateUrl: './contagem.component.html',
  styleUrls: ['./contagem.component.css']
})


export class ContagemComponent implements OnInit, OnDestroy {

  contagemForm: FormGroup;

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    private bebidaService: BebidasService,
    private contagemService: ContagemService,

    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
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


  salvarContagem() {

    // Atualizar a quantidade Total no formBuilder.
    for (const iterator of this.contagemForm.get('linhaProduto').value) {
      iterator.qTotal = this.arred(iterator.q1 / iterator.rel1 + iterator.q2 / iterator.rel2, 2);
    }

    // Gravar a contagem
    this.contagemService.add(this.contagemForm.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(

        sucess => {

          const notifyTmp: string = 'Contagem de : ' +  formatDate(sucess.dataContagem, 'shortDate', 'pt-br')  + ' - Inserida.';
          this.notify(notifyTmp);
        },

        error => {
          return console.error(error.message);
        }
      );
  }


  notify(msg: string) {
    this.snackBar.open(msg, 'OK', { duration: 3000 });
  }

  arred(numero: number, numCasaDecimais: number) {
    let numTmp = numero * Math.pow(10, numCasaDecimais);
    numTmp = Math.round(numTmp) / Math.pow(10, numCasaDecimais);
    return numTmp;
  }

  ngOnDestroy(): void {
    console.log('OnDestroy');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
