import { Component, OnInit } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

import { Bebida } from './../interfaces/bebida';
import { BebidasService } from '../servicos/bebidas.service';
import { Contagem } from '../interfaces/contagem';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { tap, map } from 'rxjs/operators';
import { ContagemService } from '../servicos/contagem.service';
import { MatSnackBar } from '@angular/material';


import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-contagem',
  templateUrl: './contagem.component.html',
  styleUrls: ['./contagem.component.css']
})


export class ContagemComponent implements OnInit {


  produtos: Bebida[] = [];
  // contagem: Contagem[] = [];

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

    this.lerProdutos();

  }

  lerProdutos() {

    this.contagemForm = this.formBuilder.group({
      // dataContagem: this.dataPipe.transform(Date(), 'dd/MM/yyyy'),
      dataContagem: Date(),
      linhaProduto: this.formBuilder.array([])
    });

    const control: FormArray = this.contagemForm.get(`linhaProduto`) as FormArray;

    this.bebidaService.get()
      .subscribe(
        (prods) => {
          this.produtos = prods;
          if (prods) {
            for (const tmp of prods) {
              control.push(this.addEqp_v01(tmp));
            }
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
      q1: [0],
      un1: [prod.estoque.unEstoque1],
      q2: [0],
      un2: [prod.estoque.unEstoque2],
      unCompra: [prod.unCompra],
      qmin: [prod.qtdeMinima]
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

    // console.log(this.contagemForm);

    const teste: Contagem = Object.assign({}, this.contagemForm.value);

    // console.log(teste);
    // console.log(this.contagemForm.value);

    // for (let i = 0, len = Object.values(this.produtos).length; i < len; i++) {
    //   console.log(i, ' - ', Object.values(teste.linhaProduto)[i]);
    // }

    // this.contagemService.add(this.contagemForm.value)
    this.contagemService.add(teste)
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


  // FIXME: Rever a passagem por esta função
  // tslint:disable-next-line: use-lifecycle-interface
  // ngOnDestroy(): void {
  //   console.warn('OnDestroy - contagem');
  //   this.unsubscribe$.next();
  //   this.unsubscribe$.complete();
  //   console.warn('OnDestroy executado');
  // }

}
