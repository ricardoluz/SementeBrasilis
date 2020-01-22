import { Injectable } from '@angular/core';

import { TipoProduto } from './../interfaces/tipo-produto';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoProdutoService {

  tipoProduto: TipoProduto[] = [];

  private baseCollection: AngularFirestoreCollection<TipoProduto> =
    this.afs.collection('apoio').doc('produtos').collection('tipoProdutos');

  constructor(
    private afs: AngularFirestore
  ) {
  }

  // getTipoProdutos(idGrupoProduto: string): Observable<TipoProduto[]> {
  getTipoProdutos(): Observable<TipoProduto[]> {
    return this.afs.collection('apoio').doc('produtos').collection('tipoProdutos', ref =>
      ref
        .orderBy('tipoProduto', 'asc')).valueChanges() as Observable<TipoProduto[]>;
    // return this.afs.collection('apoio').doc('Produtos').collection('grupoProdutos').doc(idGrupoProduto).collection('tipoProduto', ref =>
    //   ref
    //     .orderBy('tipoProduto', 'asc'))
    //   .valueChanges() as Observable<TipoProduto[]>;
  }

  getTipoProdutos_v01(idGrupoProduto: string): Observable<TipoProduto[]> {
    return this.afs.collection('apoio').doc('produtos').collection('tipoProdutos', ref =>
      ref
        .where('idGrupoProduto', '==', idGrupoProduto)
        .orderBy('tipoProduto', 'asc')).valueChanges() as Observable<TipoProduto[]>;
  }





  // addTipoProduto(p: TipoProduto, idGrupoProduto: string) {
  addTipoProduto(p: TipoProduto) {
    p.id = this.afs.createId();
    return this.baseCollection.doc(p.id).set(p);
    // return this.baseCollection.doc(idGrupoProduto).collection('tipoProduto').doc(p.id).set(p);
  }

  // deleteTipoProduto(p: TipoProduto, idGrupoProduto: string) {
  deleteTipoProduto(p: TipoProduto) {
    return this.baseCollection.doc(p.id).delete();
    // return this.baseCollection.doc(idGrupoProduto).collection('tipoProduto').doc(p.id).delete();
  }

  // updateTipoProduto(p: TipoProduto, idGrupoProduto: string) {
  updateTipoProduto(p: TipoProduto) {
    return this.baseCollection.doc(p.id).set(p);
    // return this.baseCollection.doc(idGrupoProduto).collection('tipoProduto').doc(p.id).set(p);
  }
}
