import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { Contagem } from '../interfaces/contagem';
import { tap, filter, takeUntil, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContagemService {
  readonly url = 'http://localhost:3000/contagem';

  private contagemSubject$: BehaviorSubject<Contagem[]> = new BehaviorSubject<Contagem[]>(null);
  private contagemIndividualSubject$: BehaviorSubject<Contagem> = new BehaviorSubject<Contagem>(null);
  private contagemListaSubject$: BehaviorSubject<Contagem[]> = new BehaviorSubject<Contagem[]>(null);
  private loaded = false;

  private contagemLista: Contagem[] = [];
  private contagem: Contagem = null;

  private unsubscribe$ = new Subject<void>();


  constructor(private http: HttpClient) { }

  // get(): Observable<Contagem[]> {
  //   if (!this.loaded) {
  //     this.http.get<Contagem[]>(this.url)
  //       .pipe(
  //         filter(([resultado]) => resultado != null),
  //         tap(() => console.log('get - Contagem')),
  //         //   delay(1000)
  //       )
  //       .subscribe(this.contagemSubject$);
  //     this.loaded = true;
  //   }
  //   return this.contagemSubject$.asObservable();
  // }

  // getLista(): Observable<Contagem[]> {

  //   this.http.get<Contagem[]>(`${this.url}/lista`)
  //     .pipe(
  //       filter((resultad1) => resultad1 != null),
  //       tap(() => console.log('get - Lista de Contagem')),
  //     )
  //     .subscribe(this.contagemListaSubject$);

  //   // console.log(this.contagemListaSubject$);
  //   // console.log(this.contagemListaSubject$.asObservable);

  //   return this.contagemListaSubject$.asObservable();

  //   // .subscribe(
  //   //   (retorno) => { this.contagemListaSubject$ = retorno; },
  //   //   (err => { console.log(err); })
  //   // );
  // }

  getListaContagem(): Observable<Contagem[]> {

    return this.http.get<Contagem[]>(`${this.url}/lista`).pipe(take(1));

  }


  //
  // Retonar um contagem específica (byId).
  //

  // getContagem(id: string): Contagem {

  //   this.http.get<Contagem>(`${this.url}/${id}`)
  //     .pipe(
  //       // filter(([resultado]) => resultado != null),
  //       tap(() => console.log('get - Contagem')),
  //       //   delay(1000)
  //     )
  //     .subscribe(
  //       (retorno) => {
  //         this.contagem = retorno;
  //         console.log('p1')
  //         return this.contagem;
  //       },
  //       (err) => console.log(err)
  //     );

  //   return this.contagem;
  // }

  // getContagem_v02(id: string): Observable<Contagem> {

  //   this.http.get<Contagem>(`${this.url}/${id}`)
  //     .pipe(
  //       // filter(([resultado]) => resultado != null),
  //       takeUntil(this.unsubscribe$),
  //       tap(() => console.log('get - Contagem')),
  //     )
  //     .subscribe(
  //       this.contagemIndividualSubject$
  //     );

  //   return this.contagemIndividualSubject$;
  // }

  getContagem_v03(id: string): Observable<Contagem> {

    return this.http.get<Contagem>(`${this.url}/${id}`)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(() => console.log('get - Contagem')),
      );


  }


  add(contagem: Contagem) {

    return this.http.post<Contagem>(this.url, contagem).pipe(take(1));

  }

  del(toDelete: Contagem): Observable<any> {
    return this.http.delete(`${this.url}/${toDelete._id}`)
      .pipe(
        tap(() => {
          const objectTmp = this.contagemListaSubject$.getValue();
          const i = objectTmp.findIndex(d => d._id === toDelete._id);
          if (i >= 0) {
            objectTmp.splice(i, 1);
          }
        }
        ));
  }

}
