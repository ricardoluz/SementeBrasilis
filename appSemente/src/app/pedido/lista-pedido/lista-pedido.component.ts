import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Pedido } from 'src/app/interfaces/pedido';
import { PedidoService } from 'src/app/servicos/pedido.service';

@Component({
  selector: 'app-lista-pedido',
  templateUrl: './lista-pedido.component.html',
  styleUrls: ['./lista-pedido.component.css']
})
export class ListaPedidoComponent implements OnInit {

  pedidos$: Observable<Pedido[]>;

  constructor(
    private pedidoService: PedidoService,
    private router: Router,
  ) { }

  ngOnInit() {

    // Ler os pedidos:
    this.pedidos$ = this.pedidoService.getListaPedido();
  }


  delete(p: Pedido) {
    this.pedidoService.deletePedido(p)
      .then(() => {
        // this.snackBar.open('Produto removido', 'OK', { duration: 2000 });
      })
      .catch((e) => {
        console.log(e);
        // this.snackBar.open('Error when trying to remove the product', 'OK', { duration: 2000 });
      });
  }

  edit(p: Pedido) {
    this.router.navigateByUrl('/pedidoApresentacao/' + p.id);

  }
}
