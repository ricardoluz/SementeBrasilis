import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';


import { Contagem } from '../interfaces/contagem';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ContagemService {

  readonly url = 'http://localhost:3000/contagem';
  private contagemCollection: AngularFirestoreCollection<Contagem> = this.afs.collection('contagens');

  constructor(
    private afs: AngularFirestore,
    private http: HttpClient
  ) { }


  getListaContagem(): Observable<Contagem[]> {
    return this.contagemCollection.valueChanges();
  }

  getContagemById(p: string): Observable<Contagem> {

    return this.contagemCollection.doc<Contagem>(p).valueChanges();

  }

  addContagem(p: Contagem) {
    p.id = this.afs.createId();     // Cria a string do ID.
    return this.contagemCollection.doc(p.id).set(p);
  }

  updateContagem(p: Contagem) {
    return this.contagemCollection.doc(p.id).set(p);
  }

  deleteContagem(p: Contagem) {
    return this.contagemCollection.doc(p.id).delete();
  }

  // Parte antiga em HTTP
  // getListaContagem() {

  //   return this.http.get<Contagem[]>(`${this.url}/lista`).pipe(take(1));

  // }


  getContagem(id: string) {

    return this.http.get<Contagem>(`${this.url}/${id}`).pipe(take(1));

  }


  add(contagem: Contagem) {

    return this.http.post<Contagem>(this.url, contagem).pipe(take(1));

  }


  delContagem(toDelete: Contagem) {

    return this.http.delete(`${this.url}/${toDelete._id}`).pipe(take(1));

  }

}
