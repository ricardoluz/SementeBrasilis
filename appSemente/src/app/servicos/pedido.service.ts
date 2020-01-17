// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Pedido } from '../interfaces/pedido';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PedidoService {

  readonly url = 'http://localhost:3000/pedido';
  private pedidoCollection: AngularFirestoreCollection<Pedido> = this.afs.collection('pedidos');
  private teste: AngularFirestore = this.afs;

  constructor(
    // private http: HttpClient,
    private afs: AngularFirestore) { }

  getListaPedido(): Observable<Pedido[]> {
    // return this.pedidoCollection.valueChanges();

    return this.afs.collection('pedidos', ref =>
      ref
        .orderBy('dataPedido', 'desc'))
      .valueChanges() as Observable<Pedido[]>;

  }

  getPedidoById(p: string): Observable<Pedido> {
    return this.pedidoCollection.doc<Pedido>(p).valueChanges();
  }

  addPedido(p: Pedido) {
    p.id = this.afs.createId();     // Cria a string do ID.
    return this.pedidoCollection.doc(p.id).set(p);
  }

  deletePedido(p: Pedido) {
    return this.pedidoCollection.doc(p.id).delete();
  }


  // getListaPedido() {

  //   return this.http.get<Pedido[]>(`${this.url}/lista`).pipe(take(1));

  // }


  // getPedido(id: string) {

  //   return this.http.get<Pedido>(`${this.url}/${id}`).pipe(take(1));

  // }


  // add(pedido: Pedido) {

  //   console.log(pedido);

  //   return this.http.post<Pedido>(this.url, pedido).pipe(take(1));

  // }


  // delPedido(toDelete: Pedido) {

  //   return this.http.delete(`${this.url}/${toDelete._id}`).pipe(take(1));

  // }

}
