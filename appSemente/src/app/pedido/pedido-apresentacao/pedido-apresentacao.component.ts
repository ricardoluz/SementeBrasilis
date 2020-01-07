import { Component, OnInit, OnDestroy } from '@angular/core';
import { Pedido } from 'src/app/interfaces/pedido';
import { PedidoService } from 'src/app/servicos/pedido.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pedido-apresentacao',
  templateUrl: './pedido-apresentacao.component.html',
  styleUrls: ['./pedido-apresentacao.component.css']
})
export class PedidoApresentacaoComponent implements OnInit, OnDestroy {

  pedido: Pedido;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private pedidoService: PedidoService,
  ) { }

  ngOnInit() {

    this.pedidoService.getPedido('5e13a201aa530824d18ca88c')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (retorno) => {
          this.pedido = retorno[0];
        },
        (err) => { console.log(err); }
      );
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
