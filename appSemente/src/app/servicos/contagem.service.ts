import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { Contagem } from '../interfaces/contagem';
import { tap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContagemService {
  readonly url = 'http://localhost:3000/contagem';

  private contagemSubject$: BehaviorSubject<Contagem[]> = new BehaviorSubject<Contagem[]>(null);
  private loaded = false;

  constructor(private http: HttpClient) { }

  get(): Observable<Contagem[]> {
    if (!this.loaded) {
      this.http.get<Contagem[]>(this.url)
        .pipe(
          filter(([resultado]) => resultado != null),
            tap(() => console.log('get - Contagem')),
          //   delay(1000)
        )
        .subscribe(this.contagemSubject$);
      this.loaded = true;
    }
    return this.contagemSubject$.asObservable();
  }

  add(contagem: Contagem): Observable<Contagem> {
    console.log('Contagem adicionada');
    console.log(contagem);
    return this.http.post<Contagem>(this.url, contagem)
      .pipe(
        // tap((beb: Contagem) => { this.contagemSubject$.getValue().push(beb); console.log(beb); }),
      );
  }
}
