import { PedidoService } from './../servicos/pedido.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';


import { ContagemService } from '../servicos/contagem.service';
import { Pedido } from '../interfaces/pedido';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, take } from 'rxjs/operators';
import { formatDate, DatePipe } from '@angular/common';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit, OnDestroy {

  pedidoForm: FormGroup;


  private unsubscribe$ = new Subject<void>();

  constructor(
    private contagemService: ContagemService,
    private pedidoService: PedidoService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {

  }

  ngOnInit() {

    const idContagem = this.route.snapshot.paramMap.get('id');
    this.criarPedido(idContagem);

  }

  criarPedido(idContagemTmp: string) {

    // Criar uma casca do formBuilder para o formulário.
    this.pedidoForm = this.formBuilder.group({
      dataContagem: new Date(),
      dataPedido: new Date(),
      linhaProduto: this.formBuilder.array([])
    });

    const control: FormArray = this.pedidoForm.get(`linhaProduto`) as FormArray;

    this.contagemService.getContagemById(idContagemTmp)
      .pipe(takeUntil(this.unsubscribe$), take(1))
      .subscribe(
        (prods) => {
          if (prods) {

            // Ler os dados reais para o formBuilder.

            this.pedidoForm.get('dataContagem').setValue(prods.dataContagem);

            const tmp = Object.values(prods.linhaProduto);
            for (const iterator of tmp) {
              control.push(this.addEqp_v01(iterator));
            }
            // this.pedidoForm.patchValue(prods[0]);
            // console.log(this.pedidoForm);
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  addEqp_v01(prod: any) {

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
    // pedidoTmp += 'Data Contagem: ' + formatDate(this.pedidoForm.get('dataContagem').value, 'Date', 'pt-br');
    pedidoTmp += 'Data Contagem: ' + this.pedidoForm.get('dataContagem').value.toDate().toLocaleDateString();
    pedidoTmp += '\n';
    // pedidoTmp += 'Data Pedido: ' + formatDate(this.pedidoForm.get('dataPedido').value, 'Date', 'pt-br');
    pedidoTmp += 'Data Pedido: ' + this.pedidoForm.get('dataPedido').value.toLocaleDateString();
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

    this.addPedido(this.pedidoForm.value);

    // this.pedidoService.add(this.pedidoForm.value)
    //   .pipe(
    //     takeUntil(this.unsubscribe$)
    //   )
    //   .subscribe(

    //     sucess => {
    //       // this.bebidas.push(sucess);
    //       const notifyTmp = sucess.dataPedido + ' - Inserida.';
    //       this.notify(notifyTmp);

    //       // this.clearFields();
    //       // this.blnEdicao = false;
    //     },

    //     error => {
    //       this.notify('Erro ao adicionar : ' + formatDate(this.pedidoForm.get('dataPedido').value, 'shortDate', 'pt-br'));
    //       console.error(error.mensage);
    //     }
    //   );
  }

  addPedido(p: Pedido) {
    this.pedidoService.addPedido(p)
      .then(() => {
        const notifyTmp: string = 'Pedido [' + formatDate(p.dataPedido, 'shortDate', 'pt-br') + '] adicionado.';
        this.notify(notifyTmp);

        this.router.navigateByUrl('/pedidoApresentacao/' + p.id);
      })
      .catch((c) => {
        const notifyTmp: string = 'Erro ao adicionar a Pedido.' + formatDate(p.dataPedido, 'shortDate', 'pt-br');
        this.notify(notifyTmp);
      });
  }


  arredPedido(numero: number, numCasaDecimais: number) {
    let numTmp = numero * Math.pow(10, numCasaDecimais);
    numTmp = Math.round(numTmp) / Math.pow(10, numCasaDecimais);
    if (numTmp < 0) { numTmp = 0; }
    return numTmp;
  }


  notify(msg: string) {
    this.snackBar.open(msg, 'OK', { duration: 3000 });
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}


