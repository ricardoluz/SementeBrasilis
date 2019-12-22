
import { Component, OnInit } from '@angular/core';
import { Subject, Observable, Observer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Bebida } from 'src/app/interfaces/bebida';
import { BebidasService } from 'src/app/servicos/bebidas.service';

@Component({
  selector: 'app-uso-observable',
  templateUrl: './uso-observable.component.html',
  styleUrls: ['./uso-observable.component.css']
})
export class UsoObservableComponent implements OnInit {

  private unsubscribe$: Subject<any> = new Subject();
  produtos: Bebida[] = [];
  // tmp: string;

  constructor(private bebidaService: BebidasService, ) { }

  async ngOnInit() {

    await this.lerProdutos();
    // console.log(this.produtos);
    // let tmp = this.
  }


  async lerProdutos() {

    this.bebidaService.get()
      .subscribe(
        (prods) => {
          this.produtos = prods;
          // console.log('aa');
          // console.log(prods);
          if (prods) {
            for (const tmp of prods) {
              console.log(tmp.nomeProduto);
            }
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
