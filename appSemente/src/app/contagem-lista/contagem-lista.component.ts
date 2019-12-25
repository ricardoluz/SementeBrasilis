import { MatSnackBar } from '@angular/material';
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


  // contagemListaForm = this.fb.group({
  //   _id: [''],
  //   dataContagem: ['']
  // });

  constructor(
    // private fb: FormBuilder,
    private contagemService: ContagemService,
    private snackBar: MatSnackBar
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

  delete(item: Contagem) {

    // this.clearFields();

    this.contagemService.del(item)
      .subscribe(
        () => this.notify(item.dataContagem + ' - foi apagado.'),
        (err) => this.notify(err.error.msg)
      );

    // this.blnEdicao = false;
  }


  notify(msg: string) {
    this.snackBar.open(msg, 'OK', { duration: 3000 });
  }

}
