import { Component, OnInit, OnDestroy } from '@angular/core';
import { Pedido } from 'src/app/interfaces/pedido';
import { PedidoService } from 'src/app/servicos/pedido.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    const idPedido = this.route.snapshot.paramMap.get('id');

    this.pedidoService.getPedidoById(idPedido )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (retorno) => {
          this.pedido = retorno;
        },
        (err) => { console.log(err); }
      );
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
