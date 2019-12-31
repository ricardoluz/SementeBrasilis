import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
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

    this.pedidoForm = this.formBuilder.group({
      dataContagem: Date(),
      linhaProduto: this.formBuilder.array([])
    });
  }

  ngOnInit() {

    this.criarPedido();
    console.log(this.pedidoForm);
    // this.criarPedido_v02();
    // console.log(this.contagem);
  }

  tmp() {
    console.log('xxxx');
    // this.criarPedido();
  }

  criarPedido() {

    const control: FormArray = this.pedidoForm.get(`linhaProduto`) as FormArray;

    this.contagemService.getContagem_v02('5e0b25d91f5d7d411ee99493')
      .subscribe(
        (prods) => {
          if (prods) {
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

    // return this.pedidoForm;
  }


  getForm() {
    return this.pedidoForm;
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
      qmin: [prod.qmin],
      qPedido: [0]
    });

    return group;
  }


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


