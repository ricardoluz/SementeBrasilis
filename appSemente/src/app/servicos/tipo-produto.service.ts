import { Injectable } from '@angular/core';

import { TipoProduto } from './../interfaces/tipo-produto';

@Injectable({
  providedIn: 'root'
})
export class TipoProdutoService {

  tipoProduto: TipoProduto[] = [];

  constructor() {
  }

  get(): TipoProduto[] {

    this.tipoProduto = [];    // TODO: temporário para retirar a repetição.

    this.tipoProduto.push({ _id: 'Agua', grupoProduto: 'Bebidas', tipoProduto: 'Água' });
    this.tipoProduto.push({ _id: 'CocaCola', grupoProduto: 'Bebidas', tipoProduto: 'Coca-Cola Lata' });
    this.tipoProduto.push({ _id: 'CocaCola', grupoProduto: 'Bebidas', tipoProduto: 'Coca-Cola Pet' });

    // console.log(this.tipoProduto);

    return this.tipoProduto;

  }
}
