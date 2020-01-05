import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';

import { Contagem } from '../interfaces/contagem';
import { ContagemService } from '../servicos/contagem.service';
import { Pedido } from '../interfaces/pedido';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit, OnDestroy {

  pedidoForm: FormGroup;

  private snackBar: MatSnackBar;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private contagemService: ContagemService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) {

  }

  ngOnInit() {

    const idContagem = this.route.snapshot.paramMap.get('id');
    this.criarPedido(idContagem);

  }

  criarPedido(idContagemTmp: string) {

    // Criar uma casca do formBuilder para o formulário.
    this.pedidoForm = this.formBuilder.group({
      dataContagem: new Date().toISOString(),
      dataPedido: new Date().toISOString(),
      linhaProduto: this.formBuilder.array([])
    });

    const control: FormArray = this.pedidoForm.get(`linhaProduto`) as FormArray;

    this.contagemService.getContagem_v03(idContagemTmp)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (prods) => {
          if (prods) {

            // Ler os dados reais para o formBuilder.

            this.pedidoForm.get('dataContagem').setValue(prods.dataContagem);

            const tmp = Object.values(prods);
            for (const iterator of tmp[0].linhaProduto) {
              control.push(this.addEqp_v01(iterator));
            }

            this.pedidoForm.patchValue(prods[0]);
            // console.log(this.pedidoForm);
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  addEqp_v01(prod: any) {

    // console.log(prod);
    const group = this.formBuilder.group({
      nomeProduto: [prod.nomeProduto],
      q1: [prod.q1],
      un1: [prod.un1],
      q2: [prod.q2],
      un2: [prod.un2],
      unCompra: [prod.unCompra],
      qMinima: [prod.qMinima],
      qTotal: [prod.qTotal],
      qSugestao: [this.arredPedido(prod.qMinima - prod.qTotal, 0)],
      qPedido: [this.arredPedido(prod.qMinima - prod.qTotal, 0), Validators.min(0)]
    });

    return group;
  }

  gravarPedido() {
    let pedidoTmp = '';
    pedidoTmp += 'Data Contagem: ' + formatDate(this.pedidoForm.get('dataContagem').value, 'shortDate', 'pt-br');
    pedidoTmp += '\n';
    pedidoTmp += 'Data Pedido: ' + formatDate(this.pedidoForm.get('dataPedido').value, 'shortDate', 'pt-br');
    pedidoTmp += '\n\n';

    for (const iterator of this.pedidoForm.get('linhaProduto').value) {
      if (iterator.qPedido > 0) {
        pedidoTmp += iterator.nomeProduto;
        pedidoTmp += '.'.repeat(40 - (iterator.nomeProduto).length);
        pedidoTmp += ' [ ' + iterator.qPedido + ' ]';
        pedidoTmp += '\n';
      }
    }

    alert(pedidoTmp);
  }

  arredPedido(numero: number, numCasaDecimais: number) {
    let numTmp = numero * Math.pow(10, numCasaDecimais);
    numTmp = Math.round(numTmp) / Math.pow(10, numCasaDecimais);
    if (numTmp < 0) { numTmp = 0; }
    return numTmp;
  }

  ngOnDestroy(): void {
    console.log('OnDestroy');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // getForm() {
  //   return this.pedidoForm;
  // }

  // getIds(obj) {
  //   console.log('xxx');
  //   // tslint:disable-next-line: forin
  //   for (const x in obj) {
  //     // console.log(typeof obj[x]);
  //     console.log(x);
  //     console.log(obj[x]);
  //     if (typeof obj[x] === 'object') {
  //       this.getIds(obj[x]);
  //     } else if (x === 'id') {
  //       console.log(obj.id);
  //     }
  //   }
  // }



}


