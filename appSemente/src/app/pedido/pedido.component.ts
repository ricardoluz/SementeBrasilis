import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { Contagem } from '../interfaces/contagem';
import { ContagemService } from '../servicos/contagem.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

  contagem: Contagem = null;
  pedidoForm: FormGroup;
  private snackBar: MatSnackBar;

  constructor(
    private contagemService: ContagemService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {

    this.criarPedido();

  }

  criarPedido() {

    // this.contagem = this.contagemService.getContagem('5e03705a04d89323d9804799');
    // console.log(this.contagem);
    // console.log(Object.keys(this.contagem.linhaProduto));

    // Object.keys(object).length;
    // console.log(this.contagem.linhaProduto.nomeProduto.length);

    this.pedidoForm = this.formBuilder.group({
      dataContagem: Date(),
      linhaProduto: this.formBuilder.array([
        this.formBuilder.group({
          nomeProduto: [''],
          q1: [0],
          un1: [''],
          q2: [0],
          un2: [''],
          unCompra: [''],
          qmin: [''],
          qPedido: [0]
        })
      ])
    });

    this.contagemService.getContagem_v02('5e03705a04d89323d9804799')
      .subscribe(
        (prods) => {
          // console.log(prods);
          if (prods) {
            // console.log(prods);
            // this.pedidoForm.patchValue(prods, { onlySelf: false });
            // Object.assign(this.pedidoForm, prods);
            // console.log(this.pedidoForm);
            // console.log(Object.values(prods));


            const tmp = Object.values(prods);
            console.log(tmp[0].dataContagem);
            console.log(tmp[0].linhaProduto.length);
            // this.getIds(tmp[0].linhaProduto);
            // this.getIds(tmp);
            // this.getIds(Object(prods));


            // // tslint:disable-next-line: prefer-for-of
            // for (let index = 0; index < tmp[0].linhaProduto.length; index++) {
            //   console.log(tmp[0].linhaProduto[index].nomeProduto);
            // }

            for (const iterator of tmp[0].linhaProduto) {
              console.log(iterator);
              console.log(iterator.nomeProduto);

            }

            // // console.log(tmp.keys);
            // tmp.forEach(element => {
            //   console.log(element);
            //   console.log('...');
            // });

            // let res: string = null;
            // for (const key in tmp) {
            //   if (tmp.hasOwnProperty(key)) {
            //     // const element = tmp[key];
            //     console.log(tmp[key]);
            //     // console.log(key);
            //     res += tmp[key];
            //   }
            // }
            // console.log(res);


            // for (const tmp of prods) {
            //   control.push(this.addEqp_v01(tmp));
            // }
          }
        },
        (err) => {
          console.log(err);
        }
      );



    const control: FormArray = this.pedidoForm.get(`linhaProduto`) as FormArray;





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


