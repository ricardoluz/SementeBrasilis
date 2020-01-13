import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Produto } from './../interfaces/produto';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private produtosCollection: AngularFirestoreCollection<Produto> = this.afs.collection('produtos');

  constructor(
    private afs: AngularFirestore
  ) { }

  getProdutos(): Observable<Produto[]> {
    return this.produtosCollection.valueChanges();
  }

  // getListaProdutos() {

  //   this.produtosCollection.snapshotChanges().pipe(map(teste => console.log(teste)));
  //   return 0;
  // }

  addProduto(p: Produto) {
    p.id = this.afs.createId();     // Cria a string do ID.
    return this.produtosCollection.doc(p.id).set(p);
  }

  deleteProduct(p: Produto) {
    return this.produtosCollection.doc(p.id).delete();
  }

  updateProduct(p: Produto) {
    return this.produtosCollection.doc(p.id).set(p);
  }

  // searchByName(name: string): Observable<Produto[]> {
  //   return this.afs.collection<Produto>('products',
  //     ref => ref.orderBy('name').startAt(name).endAt(name + '\uf8ff'))
  //     .valueChanges();
  // }
}
