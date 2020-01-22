
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';

import { Produto } from './../interfaces/produto';
import { TipoProdutoService } from 'src/app/servicos/tipo-produto.service';
import { map, switchMap, first, mergeAll, mergeMapTo, mergeMap, tap, switchAll, combineAll, take } from 'rxjs/operators';
import { TipoProduto } from '../interfaces/tipo-produto';


@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private produtosCollection: AngularFirestoreCollection<Produto> = this.afs.collection('produtos');
  private teste: AngularFirestore = this.afs;

  constructor(
    private afs: AngularFirestore,
    private tipoProdutoService: TipoProdutoService
  ) { }

  getProdutos_xx(): Observable<Produto[]> {
    return this.produtosCollection.valueChanges();
  }

  getProdutos(grupoProduto?: string, tipoProduto?: string): Observable<Produto[]> {

    // grupoProduto = 'Bebidas';
    // tipoProduto = 'CocaCola';

    // Sem Grupo e Tipo de produto
    if (!grupoProduto && !tipoProduto) {
      return this.afs.collection('produtos', ref =>
        ref
          .orderBy('grupoProduto', 'asc')
          .orderBy('tipoProduto', 'asc')
          .orderBy('nomeProduto', 'asc'))
        .valueChanges() as Observable<Produto[]>;
    }

    // Filtro por Grupo de produto
    if (grupoProduto && !tipoProduto) {
      return this.afs.collection('produtos', ref =>
        ref
          .where('grupoProduto', '==', grupoProduto)
          .orderBy('tipoProduto')
          .orderBy('nomeProduto'))
        .valueChanges() as Observable<Produto[]>;
    }


    // Filtro por Grupo e Tipo de produto
    if (grupoProduto && tipoProduto) {
      return this.afs.collection('produtos', ref =>
        ref
          .where('grupoProduto', '==', grupoProduto)
          .where('tipoProduto', '==', tipoProduto)
          .orderBy('nomeProduto'))
        .valueChanges() as Observable<Produto[]>;
    }
  }
  // getListaProdutos() {

  //   this.produtosCollection.snapshotChanges().pipe(map(teste => console.log(teste)));
  //   return 0;
  // }

  teste1() {
    // const lista = this.afs.collection('produtos').snapshotChanges().p;
  }
  getProdutoById(p: string): Observable<Produto> {

    return this.produtosCollection.doc(p).valueChanges() as Observable<Produto>;

  }

  // getPages(): Observable<Produto[]> {

  //   const idGrupoProduto = 'qm2vYSHfP9NNXrqXwLhY';
  //   return this.afs.collection('apoio').doc('produtos').collection('tipoProdutos', ref =>
  //     ref
  //       .where('idGrupoProduto', '==', idGrupoProduto)
  //       .orderBy('tipoProduto', 'asc')).valueChanges()
  //     .pipe(

  //       switchMap(e => {
  //         const idTipoProduto = e.map(e1 => e1.ids);

  //         this.getProdutoById(idTipoProduto.indexOf[0]) as Observable<Produto[]>;
  //         // return this.getProdutos(idGrupoProduto, idTipoProduto.indexOf[0]);
  //       }
  //       )
  //     );
  // }


  tmp(grupoProduto, tipoProduto): Observable<Produto[]> {
    return this.afs.collection('produtos', ref =>
      ref
        .where('grupoProduto', '==', grupoProduto)
        .where('tipoProduto', '==', tipoProduto)
        .orderBy('nomeProduto'))
      .valueChanges() as Observable<Produto[]>;

  }


  // getPages(): Observable<Produto[]> {

  //   const idGrupoProduto = 'qm2vYSHfP9NNXrqXwLhY';
  //   let idTipoProduto = 'sOEsYEkM8PncU5eK1QlT';
  //   const listaTipoProduto$: Observable<TipoProduto[]> = this.tipoProdutoService.getTipoProdutos_v01(idGrupoProduto);

  //   // return listaProduto$ as Observable<Produto[]>;
  //   const listaProdutos$: Observable<Produto[]> = listaTipoProduto$.
  //     pipe(
  //       map((e) => {
  //         e.map(e1 => {
  //           console.log(e1.id);
  //           idTipoProduto = e1.id;
  //         });
  //         // this.tmp(idGrupoProduto, idTipoProduto).pipe(take(1));
  //         // .subscribe();
  //         this.afs.collection('produtos', ref =>
  //           ref
  //             .where('grupoProduto', '==', idGrupoProduto)
  //             .where('tipoProduto', '==', idTipoProduto)
  //             .orderBy('nomeProduto'))
  //           .valueChanges();


  //       }),
  //       take(1)
  //     );

  //   const resultado$ = listaProdutos$.pipe(
  //     combineAll()
  //   );

  //   return resultado$;
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
