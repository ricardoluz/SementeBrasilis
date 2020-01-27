import { Injectable } from '@angular/core';
import { GrupoProduto } from '../interfaces/grupo-produto';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrupoProdutoService {

  grupoProduto: GrupoProduto[] = [];

  private baseCollection: AngularFirestoreCollection<GrupoProduto> =
    this.afs.collection('apoio').doc('produtos').collection('grupoProdutos');


  constructor(
    private afs: AngularFirestore
  ) {
  }


  getGrupoProdutos(): Observable<GrupoProduto[]> {
    // return this.baseCollection.valueChanges();
    return this.afs.collection('apoio').doc('produtos').collection('grupoProdutos', ref =>
      ref
        .orderBy('grupoProduto', 'asc'))
      .valueChanges() as Observable<GrupoProduto[]>;
  }


  getNomeGrupoProduto(idGrupoProduto): Observable<GrupoProduto> {

    return this.baseCollection.doc(idGrupoProduto).valueChanges() as Observable<GrupoProduto>;

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
