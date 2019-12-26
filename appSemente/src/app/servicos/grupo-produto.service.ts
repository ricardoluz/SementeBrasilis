import { Injectable } from '@angular/core';
import { GrupoProduto } from '../interfaces/grupo-produto';

@Injectable({
  providedIn: 'root'
})
export class GrupoProdutoService {

  grupoProduto: GrupoProduto[] = [];

  constructor() {
  }

  get(): GrupoProduto[] {

    this.grupoProduto.push({ _id: 'Bebidas', grupoProduto: 'Bebidas' });
    // this.grupoProduto.push({ _id: 'CocaCola', grupoProduto: 'Bebidas' });
    // this.grupoProduto.push({ _id: 'CocaCola', grupoProduto: 'Bebidas' });

    // console.log(this.grupoProduto);

    return this.grupoProduto;

  }

}
