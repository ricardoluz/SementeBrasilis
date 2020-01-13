import { Component, OnInit } from '@angular/core';
import { ProdutoService } from '../servicos/produto.service';
import { Observable } from 'rxjs';
import { Produto } from '../interfaces/produto';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-teste',
  templateUrl: './teste.component.html',
  styleUrls: ['./teste.component.css']
})
export class TesteComponent implements OnInit {

  produtos$: Observable<Produto[]>;
  teste: any;

  constructor(
    private produtoService: ProdutoService,
  ) { }

  ngOnInit() {

    this.produtos$ = this.produtoService.getProdutos();
    this.teste1();
  }

  teste1() {
    console.log('aa');

    this.teste = this.produtos$.pipe(
      map(actions => actions.map(a => {
        // const data = a. a.payload.doc.data() as Shirt;
        // const id = a.payload.doc.id;
        console.log(a.nomeProduto);
        // return { id, ...data };
      }))
    ).subscribe();

    // throw new Error('Method not implemented.');
  }

}
