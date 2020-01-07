import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';


import { Contagem } from '../interfaces/contagem';

@Injectable({
  providedIn: 'root'
})

export class ContagemService {

  readonly url = 'http://localhost:3000/contagem';

  constructor(private http: HttpClient) { }


  getListaContagem() {

    return this.http.get<Contagem[]>(`${this.url}/lista`).pipe(take(1));

  }


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
