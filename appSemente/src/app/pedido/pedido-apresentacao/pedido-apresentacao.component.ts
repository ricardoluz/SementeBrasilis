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

    this.pedidoService.getPedidoById('awccorERdLFgC1AhEBxu')
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
