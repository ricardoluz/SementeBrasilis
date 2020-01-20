import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { GrupoProduto } from 'src/app/interfaces/grupo-produto';
import { GrupoProdutoService } from 'src/app/servicos/grupo-produto.service';
import { TipoProduto } from 'src/app/interfaces/tipo-produto';
import { TipoProdutoService } from 'src/app/servicos/tipo-produto.service';

@Component({
  selector: 'app-tipo-produto-registro',
  templateUrl: './tipo-produto-registro.component.html',
  styleUrls: ['./tipo-produto-registro.component.css']
})

export class TipoProdutoRegistroComponent implements OnInit {

  dadosForm = this.fb.group({});
  // tmp = '8xTAquHUZuJ2GYjxurl3';
  grupoProduto$: Observable<GrupoProduto[]>;
  tipoProduto$: Observable<TipoProduto[]>;


  constructor(
    private grupoProdutoService: GrupoProdutoService,
    private tipoProdutoService: TipoProdutoService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {

    this.montarFormulario();
    this.grupoProduto$ = this.grupoProdutoService.getGrupoProdutos();
    this.tipoProduto$ = this.tipoProdutoService.getTipoProdutos1('');

  }

  teste(valor){
    // console.log(valor);
    // alert(valor);
    this.tipoProduto$ = this.tipoProdutoService.getTipoProdutos1(valor.value);
  }

  montarFormulario() {
    this.dadosForm = this.fb.group({
      id: [undefined],
      idGrupoProduto: [''],
      tipoProduto: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit() {
    const p: TipoProduto = this.dadosForm.value;
    if (!p.id) {
      this.add(p);
    } else {
      this.update(p);
    }
  }


  add(p: TipoProduto) {
    // this.tipoProdutoService.addTipoProduto(p, this.dadosForm.get('grupoProduto').value)
    this.tipoProdutoService.addTipoProduto(p)
      .then(() => {
        this.snackBar.open('TipoProduto adicionado.', 'OK', { duration: 2000 });
        this.clearFields();
      })
      .catch(() => {
        this.snackBar.open('Error on submiting the product.', 'OK', { duration: 2000 });
      });
  }

  update(p: TipoProduto) {
    this.tipoProdutoService.updateTipoProduto(p)
      .then(() => {
        this.snackBar.open('GrupoProduto atualizado', 'OK', { duration: 2000 });
        this.clearFields();
      })
      .catch((e) => {
        console.log(e);
        this.snackBar.open('Error updating the product', 'OK', { duration: 2000 });
      });

  }

  edit(p: TipoProduto) {
    this.dadosForm.setValue(p);
  }

  delete(p: TipoProduto) {
    this.tipoProdutoService.deleteTipoProduto(p)
      .then(() => {
        this.snackBar.open('Tipo de Produto removido', 'OK', { duration: 2000 });
      })
      .catch((e) => {
        console.log(e);
        this.snackBar.open('Error when trying to remove the product', 'OK', { duration: 2000 });
      });
  }

  clearFields() {

    this.montarFormulario();

  }

}
