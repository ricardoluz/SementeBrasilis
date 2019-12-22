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

    this.unidadeMedida.push({ _id: 'Caixa', nomeUnidade: 'Caixa' });
    this.unidadeMedida.push({ _id: 'Unidade', nomeUnidade: 'Unidade' });
    this.unidadeMedida.push({ _id: 'Saco', nomeUnidade: 'Saco' });

    return this.unidadeMedida;
  }
}
