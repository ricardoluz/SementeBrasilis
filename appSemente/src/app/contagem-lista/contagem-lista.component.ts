import { formatDate } from '@angular/common';
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

    this.contagemService.getListaContagem()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (retorno) => {
          this.contagemLista = retorno;
          // console.log(retorno);
        },
        (err) => { console.log(err); }
      );
  }

  delete(p: Contagem) {
    this.contagemService.deleteContagem(p)
      .then(() => {
        this.snackBar.open('Contagem removida', 'OK', { duration: 2000 });
      })
      .catch((e) => {
        console.log(e);
        this.snackBar.open('Error when trying to remove the product', 'OK', { duration: 2000 });
      });
  }

  delete_(item: Contagem) {

    this.contagemService.delContagem(item)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(

        sucess => {
          this.notify('Contagem : ' + formatDate(item.dataContagem, 'shortDate', 'pt-br') + ' - foi apagada.');

          const i = this.contagemLista.findIndex(d2 => {
            return d2._id === item._id;
          });
          if (i >= 0) {
            this.contagemLista.splice(i, 1);
          }
        },

        error => {
          this.notify('Erro ao apagar a contagem : ' + formatDate(item.dataContagem, 'shortDate', 'pt-br'));
          console.error(error.message);
        }

      );

    // this.blnEdicao = false;
  }

  edit(id: string) {
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
