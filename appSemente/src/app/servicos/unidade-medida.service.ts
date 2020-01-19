import { Injectable } from '@angular/core';

import { UnidadeMedida } from './../interfaces/unidade-medida';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnidadeMedidaService {

  // tslint:disable-next-line: variable-name
  unidadeMedida: UnidadeMedida[] = [];


  constructor() {
  }

  get(): UnidadeMedida[] {

    this.unidadeMedida = [];    // TODO: temporário para retirar a repetição.

    this.unidadeMedida.push({ _id: null, nomeUnidade: '* Vazia *' });
    this.unidadeMedida.push({ _id: 'Caixa', nomeUnidade: 'Caixa' });
    this.unidadeMedida.push({ _id: 'Pack', nomeUnidade: 'Pack' });
    this.unidadeMedida.push({ _id: 'Saco', nomeUnidade: 'Saco' });
    this.unidadeMedida.push({ _id: 'Unidade', nomeUnidade: 'Unidade' });

    return this.unidadeMedida;
  }
}
