import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { NFCEs } from '../interfaces/nfces';
import { NfceService } from './../servicos/nfce.service';
import { takeUntil, map } from 'rxjs/operators';

@Component({
  selector: 'app-vendas-produto-periodo',
  templateUrl: './vendas-produto-periodo.component.html',
  styleUrls: ['./vendas-produto-periodo.component.css']
})
export class VendasProdutoPeriodoComponent implements OnInit {

  vendas$: Observable<NFCEs[]>;
  d1 = '2020-01-02T08:00:00-03:00';
  d2 = '2020-01-02T08:17:59-03:00';

  private unsubscribe$ = new Subject<void>();

  constructor(
    private nfceService: NfceService
  ) { }

  ngOnInit() {

    // Ler as NFCe

    this.vendas$ = this.nfceService.getDadosNfceVenda(this.d1, this.d2);

    this.lerNFCEs();

  }

  lerNFCEs() {

    this.nfceService.getDadosNfceVenda(this.d1, this.d2)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (retorno) => {
          // const produtos = Object.assign(retorno.produtos)
          // console.log(retorno);

          // console.log(retorno[0].produtos);

          for (const iterator of retorno) {
            console.log(iterator.idNFCE);
            
          }

        }
      )
  }

}
