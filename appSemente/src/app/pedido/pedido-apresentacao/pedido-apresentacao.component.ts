import { ProdutoService } from './../../servicos/produto.service';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Pedido } from 'src/app/interfaces/pedido';
import { PedidoService } from 'src/app/servicos/pedido.service';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { takeUntil, map, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-pedido-apresentacao',
  templateUrl: './pedido-apresentacao.component.html',
  styleUrls: ['./pedido-apresentacao.component.css']
})
export class PedidoApresentacaoComponent implements OnInit, OnDestroy {

  @ViewChild('txtMsgWhatsApp', { static: false }) txtMsgWhatsApp: ElementRef;

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

          // pedidoTmp += this.linhaWhatApp('*Semente Brasilis*');
          // pedidoTmp += this.linhaWhatApp('*Código Loja: 253088*');
          pedidoTmp += '*Semente Brasilis*\n';
          pedidoTmp += '*Código Loja: 253088*\n';
          // pedidoTmp += this.linhaWhatApp('-'.repeat(30));
          pedidoTmp += '\n';

          for (const iterator of tmp) {
            if (iterator.qPedido > 0) {
              // pedidoTmp += '```' + iterator.nomeProduto;
              // pedidoTmp += '.'.repeat(40 - (iterator.nomeProduto).length);
              // pedidoTmp += ' [ ' + iterator.qPedido + ' ] ' + iterator.unCompra + '(s)';
              // pedidoTmp += '```\n';

              pedidoTmp += '. ' + this.linhaWhatApp(iterator.nomeProduto);
              pedidoTmp += this.linhaWhatApp('  [ ' + iterator.qPedido + ' ] ' + iterator.unCompra + '(s)');
              pedidoTmp += '\n';
            }
          }
          pedidoTmp += this.linhaWhatApp('. '.repeat(8));
          // console.log(pedidoTmp);
          this.pedidoString = pedidoTmp;
          // this.txtMsgWhatsApp.nativeElement.setSelectionRange(0, 0);
          // this.txtMsgWhatsApp.nativeElement = pedidoTmp;
        },
        (err) => { console.log(err); }
      );
  }

  linhaWhatApp(texto: string) {
    return ('```' + texto + '```\n');
  }


  copyToCB() {
    if (this.txtMsgWhatsApp) {
      // Select textarea text
      this.txtMsgWhatsApp.nativeElement.select();


      // Copy to the clipboard
      document.execCommand('copy');

      // Deselect selected textarea
      this.txtMsgWhatsApp.nativeElement.setSelectionRange(0, 0);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
