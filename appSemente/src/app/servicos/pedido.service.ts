import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';


import { Pedido } from '../interfaces/pedido';

@Injectable({
  providedIn: 'root'
})

export class PedidoService {

  readonly url = 'http://localhost:3000/pedido';

  constructor(private http: HttpClient) { }


  getListaPedido() {

    return this.http.get<Pedido[]>(`${this.url}/lista`).pipe(take(1));

  }


  getPedido(id: string) {

    return this.http.get<Pedido>(`${this.url}/${id}`).pipe(take(1));

  }


  add(pedido: Pedido) {

    console.log(pedido);

    return this.http.post<Pedido>(this.url, pedido).pipe(take(1));

  }


  delPedido(toDelete: Pedido) {

    return this.http.delete(`${this.url}/${toDelete._id}`).pipe(take(1));

  }

}
