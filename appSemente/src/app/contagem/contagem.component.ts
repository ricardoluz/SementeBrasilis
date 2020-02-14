import { NotificacaoService } from './../servicos/utilidades/notificacao.service';
import { formatDate } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Subject, Observable } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

import { Contagem } from './../interfaces/contagem';
import { GrupoProduto } from '../interfaces/grupo-produto';
import { Produto } from '../interfaces/produto';

import { ContagemService } from '../servicos/contagem.service';
import { GrupoProdutoService } from '../servicos/grupo-produto.service';
import { ProdutoService } from './../servicos/produto.service';
import { TipoProdutoService } from './../servicos/tipo-produto.service';
import { ConversoesService } from '../servicos/utilidades/conversoes.service';
import { isArray } from 'util';

@Component({
  selector: 'app-contagem',
  templateUrl: './contagem.component.html',
  styleUrls: ['./contagem.component.css']
})

export class ContagemComponent implements OnInit, OnDestroy {

  blnInclusaoContagem: boolean;

  contagemForm: FormGroup;

  private unsubscribe$: Subject<any> = new Subject();

  grupoProduto$: Observable<GrupoProduto[]>;
  private nomeGrupoProduto: string;

  constructor(
    private produtoService: ProdutoService,
    private contagemService: ContagemService,
    private grupoProdutoService: GrupoProdutoService,
    private tipoProdutoService: TipoProdutoService,
    private conversoesService: ConversoesService,
    private notificacaoService: NotificacaoService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    const idContagem = this.route.snapshot.paramMap.get('id');

    if (idContagem == null) {

      this.blnInclusaoContagem = true;
      this.grupoProduto$ = this.grupoProdutoService.getGrupoProdutos();

    } else {

      this.blnInclusaoContagem = false;
      this.lerFormContagem(idContagem);

    }
  }

  ngOnDestroy(): void {
    // console.log('OnDestroy');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  funSelectGrupoProduto(e: any) {

    this.criarFormContagem_v01(e.value);
    this.retornaNomeGrupo(e.value);

  }


  criarFormContagem_v01(idGrupoProduto: string) {

    // TODO: Melhorar esta solução utilzando CombineAll (rxjs)

    // this.contagemForm = this.formBuilder.group({
    //   dataContagem: new Date(),
    //   nomeGrupoProduto: '',   // Será atualizado no submit. TODO: Rever esta solução.
    //   linhaProduto: this.formBuilder.array([])
    // });
    this.criarHeaderForm();

    // console.log(this.nomeGrupoProduto);

    const control: FormArray = this.contagemForm.get(`linhaProduto`) as FormArray;

    this.tipoProdutoService.getTipoProdutos_v01(idGrupoProduto)
      .pipe(
        takeUntil(this.unsubscribe$),
        take(1))
      .subscribe(
        (tipoProds) => {

          if (tipoProds) {
            tipoProds.map((e) => {
              this.retornaProdutos(idGrupoProduto, e.id, control);
            });
          }
        },
        (err) => {
          console.log(err);
        }
      );

  }


  criarHeaderForm() {
    this.contagemForm = this.formBuilder.group({
      id: null,
      dataContagem: new Date(),
      nomeGrupoProduto: '',   // Será atualizado no submit. TODO: Rever esta solução.
      linhaProduto: this.formBuilder.array([])
    });
  }


  lerFormContagem(idContagem) {

    // alert(idContagem);
    this.criarHeaderForm();

    // TODO: Solução temporária : Estudar o texto :
    // https://ultimatecourses.com/blog/angular-2-form-controls-patch-value-set-value#patchvalue
    // Para melhorar este modo de leitura do formulário

    this.contagemService.getContagemById(idContagem)
      .subscribe(
        (retorno) => {

          this.contagemForm.get('id').setValue(idContagem);

          // const teste = { nanoseconds: 0, seconds: 120 };
          // Object.assign(teste, retorno.dataContagem);
          // const testeTmp = teste.seconds * 1000;

          // const testeDate = new Date(formatDate(testeTmp, 'yyyy/MM/dd hh:mm:ss', 'pt-br'));

          this.contagemForm.get('dataContagem').setValue(this.conversoesService.objectTimeStampToDate(retorno.dataContagem));

          this.contagemForm.get('nomeGrupoProduto').setValue(retorno.nomeGrupoProduto);

          const control: FormArray = this.contagemForm.get(`linhaProduto`) as FormArray;

          // tslint:disable-next-line: forin
          for (const i in retorno.linhaProduto) {
            control.push(this.addEqp_v01_update(retorno.linhaProduto[i]));
          }

          // console.log(this.contagemForm);

        }
      );

  }

  retornaNomeGrupo(idGrupoProduto: string) {

    this.grupoProdutoService.getNomeGrupoProduto(idGrupoProduto)
      .pipe(takeUntil(this.unsubscribe$), take(1))
      .subscribe(success => {
        this.nomeGrupoProduto = success.grupoProduto;
        console.log(this.nomeGrupoProduto);
      }, (err) => {
        console.log(err);
        return '** Erro ***';
      });
  }

  retornaProdutos(idGrupoProdutoTmp: string, idTipoProdutoTmp: string, control: FormArray) {
    this.produtoService.getProdutos(idGrupoProdutoTmp, idTipoProdutoTmp)
      .pipe(
        takeUntil(this.unsubscribe$),
        take(1))
      .subscribe(
        (prods) => {

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


  addEqp_v01(prod: Produto) {
    const group = this.formBuilder.group({
      nomeProduto: [prod.nomeProduto],
      q1: [0, [Validators.required, Validators.min(0)]],
      un1: [prod.estoque.unEstoque1],
      rel1: [prod.estoque.rlEstoqueCompra1],
      q2: [0, [Validators.required, Validators.min(0)]],
      un2: [prod.estoque.unEstoque2],
      rel2: [prod.estoque.rlEstoqueCompra2],
      unCompra: [prod.unCompra],
      qMinima: [prod.qtdeMinima],
      precoCompra: [prod.precoCompra],
      qTotal: [0]
    });
    return group;
  }

  addEqp_v01_update(prodContagem) {
    // TODO: Tipificar prodContagem
    const group = this.formBuilder.group({
      nomeProduto: [prodContagem.nomeProduto],
      q1: [prodContagem.q1, [Validators.required, Validators.min(0)]],
      un1: [prodContagem.un1],
      rel1: [prodContagem.rel1],
      q2: [prodContagem.q2, [Validators.required, Validators.min(0)]],
      un2: [prodContagem.un2],
      rel2: [prodContagem.rel2],
      unCompra: [prodContagem.unCompra],
      qMinima: [prodContagem.qMinima],
      precoCompra: [prodContagem.precoCompra],
      qTotal: [prodContagem.qTotal]
    });
    return group;
  }

  onSubmit() {

    // Atualizar a quantidade Total no formBuilder.
    for (const iterator of this.contagemForm.get('linhaProduto').value) {
      iterator.qTotal = iterator.q1 / iterator.rel1;
      if (!(iterator.un2 === '')) {
        iterator.qTotal = iterator.qTotal + iterator.q2 / iterator.rel2;
      }
      iterator.qTotal = this.arred(iterator.qTotal, 2);
    }

    const p: Contagem = this.contagemForm.value;
    if (!p.id) {

      // Atualizar a contagem com o nomeGrupoProduto
      p.nomeGrupoProduto = this.nomeGrupoProduto;

      this.addContagem(p);
      // FIXME: Solução temporária para evitar a inclusao de outra contagem.
      this.router.navigate(['/listaContagem']);

    } else {

      this.updateContagem(p);
      this.router.navigate(['/listaContagem']);

    }
  }

  addContagem(p: Contagem) {
    this.contagemService.addContagem(p)
      .then(() => {
        const notifyTmp: string = 'Contagem [' + formatDate(p.dataContagem, 'shortDate', 'pt-br') + '] adicionada.';
        this.notify(notifyTmp);
        // this.clearFields();
      })
      .catch((c) => {
        const notifyTmp: string = 'Erro ao adicionar a Contagem de ' + formatDate(p.dataContagem, 'shortDate', 'pt-br');
        this.notify(notifyTmp);
        // this.snackBar.open('Erro ao adicionar a Contagem.', 'OK', { duration: 2000 });
      });
  }

  updateContagem(p: Contagem) {
    this.contagemService.updateContagem(p)
      .then(() => {
        const notifyTmp: string = 'Contagem ' + formatDate(p.dataContagem, 'shortDate', 'pt-br') + ' atualizada.';
        this.notify(notifyTmp);
        // this.clearFields();
      })
      .catch((e) => {
        console.log(e);
        const notifyTmp: string = 'Erro ao adicionar a Contagem.' + formatDate(p.dataContagem, 'shortDate', 'pt-br');
        this.notify(notifyTmp);
      });

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

          const notifyTmp: string = 'Contagem de : ' + formatDate(sucess.dataContagem, 'shortDate', 'pt-br') + ' - Inserida.';
          this.notify(notifyTmp);
        },

        error => {
          return console.error(error.message);
        }
      );
  }


  notify(msg: string) {
    this.notificacaoService.notificacao(msg);
  }


  arred(numero: number, numCasaDecimais: number) {
    let numTmp = numero * Math.pow(10, numCasaDecimais);
    numTmp = Math.round(numTmp) / Math.pow(10, numCasaDecimais);
    return numTmp;
  }

}
