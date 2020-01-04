import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';


import { ContagemService } from '../servicos/contagem.service';
import { Contagem } from '../interfaces/contagem';

@Component({
  selector: 'app-contagem-lista',
  templateUrl: './contagem-lista.component.html',
  styleUrls: ['./contagem-lista.component.css']
})
export class ContagemListaComponent implements OnInit, OnDestroy {

  contagemLista: Contagem[];
  private unsubscribe$ = new Subject<void>();

  constructor(
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

  edit(){
    alert('Função em desenvolvimento.');
  }


  notify(msg: string) {
    this.snackBar.open(msg, 'OK', { duration: 3000 });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    console.log('OnDestroy');
  }

}
