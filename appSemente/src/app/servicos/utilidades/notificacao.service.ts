import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { isUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {

  constructor(private snackBar: MatSnackBar) { }

  notificacao(msg: string, duracao?: number) {
    if (isUndefined(duracao)) { duracao = 3000; }
    this.snackBar.open(msg, 'Ok', { duration: duracao });
  }

}
