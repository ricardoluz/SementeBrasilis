import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, delay, take } from 'rxjs/operators';

import { Bebida } from '../interfaces/bebida';

@Injectable({
  providedIn: 'root'
})
export class BebidasService {

  readonly url = 'http://localhost:3000/produto';

  constructor(private http: HttpClient) { }

  get() {

    return this.http.get<Bebida[]>(this.url).pipe(take(1));

  }

  add(bebida: Bebida) {

    return this.http.post<Bebida>(this.url, bebida).pipe(take(1));

  }

  del(toDelete: Bebida) {

    return this.http.delete(`${this.url}/${toDelete._id}`).pipe(take(1));

  }

  update_v02(prmUpdate: Bebida) {

    return this.http.patch<Bebida>(`${this.url}/${prmUpdate._id}`, prmUpdate).pipe(take(1));

  }

}
