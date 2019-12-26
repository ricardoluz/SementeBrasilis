import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

import { Bebida } from '../interfaces/bebida';

@Injectable({
  providedIn: 'root'
})
export class BebidasService {

  readonly url = 'http://localhost:3000/produto';

  private bebidasSubject$: BehaviorSubject<Bebida[]> = new BehaviorSubject<Bebida[]>(null);
  public bebidas$ = this.bebidasSubject$.asObservable();

  private loaded = false;

  constructor(private http: HttpClient) { }

  get(): Observable<Bebida[]> {
    if (!this.loaded) {
      this.http.get<Bebida[]>(this.url)
        // .pipe(
        //   tap((x) => console.log(x)),
        //   delay(1000)
        // )
        .subscribe(this.bebidasSubject$);
      this.loaded = true;
    }
    console.log(this.bebidasSubject$);
    return this.bebidasSubject$.asObservable();
  }

  add(bebida: Bebida): Observable<Bebida> {
    console.log('Bebida adicionada');
    console.log(bebida);
    return this.http.post<Bebida>(this.url, bebida)
      .pipe(
        tap((beb: Bebida) => { this.bebidasSubject$.getValue().push(beb); console.log(beb); }),
      );
  }

  del(toDelete: Bebida): Observable<any> {
    return this.http.delete(`${this.url}/${toDelete._id}`)
      .pipe(
        tap(() => {
          const bebidasTmp = this.bebidasSubject$.getValue();
          const i = bebidasTmp.findIndex(d => d._id === toDelete._id);
          if (i >= 0) {
            bebidasTmp.splice(i, 1);
          }
        }
        ));
  }

  update(prmUpdate: Bebida): Observable<Bebida> {
    // console.warn(prmUpdate);
    return this.http.patch<Bebida>(`${this.url}/${prmUpdate._id}`, prmUpdate)
      .pipe(
        tap((d) => {
          const bebidas = this.bebidasSubject$.getValue();
          const i = bebidas.findIndex(d2 => {
            return d2._id === prmUpdate._id;
          });
          if (i >= 0) {
            // bebidas[i].nomeProduto = d.nomeProduto;
            bebidas[i] = d;
          }
        })
      );
  }
}
