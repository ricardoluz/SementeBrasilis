import { ProdutoService } from './../../servicos/produto.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Pedido } from 'src/app/interfaces/pedido';
import { PedidoService } from 'src/app/servicos/pedido.service';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { takeUntil, map, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pedido-apresentacao',
  templateUrl: './pedido-apresentacao.component.html',
  styleUrls: ['./pedido-apresentacao.component.css']
})
export class PedidoApresentacaoComponent implements OnInit, OnDestroy {

  pedido: Pedido;
  pedidoString = '';
  pedido$: Observable<Pedido>;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private pedidoService: PedidoService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    const idPedido = this.route.snapshot.paramMap.get('id');

    this.pedido$ = this.pedidoService.getPedidoById(idPedido);

    this.pedidoService.getPedidoById(idPedido)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (retorno) => {
          let pedidoTmp = '';
          const tmp = Object.assign(retorno.linhaProduto);
          for (const iterator of tmp) {
            pedidoTmp += '```' + iterator.nomeProduto;
            pedidoTmp += '.'.repeat(40 - (iterator.nomeProduto).length);
            pedidoTmp += ' [ ' + iterator.qPedido + ' ] ' + iterator.unCompra + '(s)';
            pedidoTmp += '```\n';
          }
          console.log(pedidoTmp);
          this.pedidoString = pedidoTmp;
        },
        (err) => { console.log(err); }
      );
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
