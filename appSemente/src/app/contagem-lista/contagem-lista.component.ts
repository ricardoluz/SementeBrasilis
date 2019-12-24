import { Observable, Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { ContagemService } from '../servicos/contagem.service';
import { Contagem } from '../interfaces/contagem';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-contagem-lista',
  templateUrl: './contagem-lista.component.html',
  styleUrls: ['./contagem-lista.component.css']
})
export class ContagemListaComponent implements OnInit {

  contagemLista: Contagem[];
  private unsubscribe$: Subject<any> = new Subject();

  contagemListaForm = this.fb.group({
    _id: [''],
    dataContagem: ['']
  });

  constructor(
    private fb: FormBuilder,
    private contagemService: ContagemService
  ) { }

  ngOnInit() {

    this.contagemService.getLista()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (retorno) => {
          this.contagemLista = retorno;
          console.log(retorno);
        },
        (err) => { console.log(err); }
      );
  }

}
