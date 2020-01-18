import { Injectable } from '@angular/core';
import { GrupoProduto } from '../interfaces/grupo-produto';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrupoProdutoService {

  grupoProduto: GrupoProduto[] = [];

  private baseCollection: AngularFirestoreCollection<GrupoProduto> =
    this.afs.collection('apoio').doc('Produtos').collection('grupoProdutos');

  constructor(
    private afs: AngularFirestore
  ) {
  }

  get(): GrupoProduto[] {

    this.grupoProduto = [];     // TODO: temporário para retirar a repetição.

    this.grupoProduto.push({ _id: 'Bebidas', grupoProduto: 'Bebidas' });
    // this.grupoProduto.push({ _id: 'CocaCola', grupoProduto: 'Bebidas' });
    // this.grupoProduto.push({ _id: 'CocaCola', grupoProduto: 'Bebidas' });

    // console.log(this.grupoProduto);

    return this.grupoProduto;

  }

  getGrupoProdutos(): Observable<GrupoProduto[]> {
    return this.baseCollection.valueChanges();
  }

  addGrupoProduto(p: GrupoProduto) {
    p.id = this.afs.createId();
    return this.baseCollection.doc(p.id).set(p);
  }

  deleteGrupoProduto(p: GrupoProduto) {
    return this.baseCollection.doc(p.id).delete();
  }

  updateGrupoProduto(p: GrupoProduto) {
    return this.baseCollection.doc(p.id).set(p);
  }

}
