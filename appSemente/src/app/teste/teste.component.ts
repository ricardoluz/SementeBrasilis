import { Component, OnInit } from '@angular/core';
import { DadosNFCE } from '../interfaces/nfceDados';


@Component({
  selector: 'app-teste',
  templateUrl: './teste.component.html',
  styleUrls: ['./teste.component.css']
})

// tslint:disable-next-line: component-class-suffix
class ResumoProduto {
  codProduto: string;
  total: number;
}

export class TesteComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit() {

  }


  private createOrFindAuthor(array: ResumoProduto[], recipe: DadosNFCE): ResumoProduto {

    const codProduto = (recipe.codProduto.length > 0 ? recipe.codProduto : 'UNKNOWN');

    let found = array.find(i => i.codProduto === codProduto);
    console.log(found);

    if (!found) {
      const dados = new ResumoProduto();

      dados.codProduto = codProduto;
      dados.total = 0;
      array.push(dados);

      found = dados;
    }

    return found;
  }
}
