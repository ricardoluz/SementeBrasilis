import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { Contagem } from '../interfaces/contagem';
import { ContagemService } from '../servicos/contagem.service';
import { Pedido } from '../interfaces/pedido';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

  contagem: Contagem = null;
  pedido: Pedido;
  pedidoForm: FormGroup;
  private snackBar: MatSnackBar;

  constructor(
    private contagemService: ContagemService,
    private formBuilder: FormBuilder,
  ) {

  }

  ngOnInit() {

    this.criarPedido();

  }

  // tmp() {
  //   console.log('xxxx');
  //   // this.criarPedido();
  // }

  criarPedido() {

    // Criar uma casca do formBuilder para 'enganar' o formulário.
    this.pedidoForm = this.formBuilder.group({
      dataContagem: Date(),
      linhaProduto: this.formBuilder.array([])
    });

    this.contagemService.getContagem_v02('5e0bbc23ab000c4ab913142e')
      .subscribe(
        (prods) => {
          if (prods) {

            // Ler os dados reais para o formBuilder.

            this.pedidoForm = this.formBuilder.group({
              dataContagem: prods.dataContagem,
              linhaProduto: this.formBuilder.array([])
            });

            const control: FormArray = this.pedidoForm.get(`linhaProduto`) as FormArray;

            const tmp = Object.values(prods);
            for (const iterator of tmp[0].linhaProduto) {
              control.push(this.addEqp_v01(iterator));
            }

            this.pedidoForm.patchValue(prods[0]);
            console.log(this.pedidoForm);
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

  arredPedido(numero: number, numCasaDecimais: number) {
    let numTmp = numero * Math.pow(10, numCasaDecimais);
    numTmp = Math.round(numTmp) / Math.pow(10, numCasaDecimais);
    if (numTmp < 0)  { numTmp = 0; }
    return numTmp;
  }


  // getForm() {
  //   return this.pedidoForm;
  // }

  getIds(obj) {
    console.log('xxx');
    // tslint:disable-next-line: forin
    for (const x in obj) {
      // console.log(typeof obj[x]);
      console.log(x);
      console.log(obj[x]);
      if (typeof obj[x] === 'object') {
        this.getIds(obj[x]);
      } else if (x === 'id') {
        console.log(obj.id);
      }
    }
  }



}


