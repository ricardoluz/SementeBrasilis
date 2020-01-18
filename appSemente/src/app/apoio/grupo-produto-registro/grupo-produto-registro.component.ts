import { Observable } from 'rxjs';
import { GrupoProduto } from './../../interfaces/grupo-produto';
import { Component, OnInit } from '@angular/core';
import { GrupoProdutoService } from 'src/app/servicos/grupo-produto.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-grupo-produto-registro',
  templateUrl: './grupo-produto-registro.component.html',
  styleUrls: ['./grupo-produto-registro.component.css']
})
export class GrupoProdutoRegistroComponent implements OnInit {

  dadosForm = this.fb.group({});
  grupoProduto$: Observable<GrupoProduto[]> ;

  constructor(
    private grupoProdutoService: GrupoProdutoService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.montarFormulario();
    this.grupoProduto$ = this.grupoProdutoService.getGrupoProdutos();
  }

  montarFormulario() {
    this.dadosForm = this.fb.group({
      id: [undefined],
      grupoProduto: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit() {
    const p: GrupoProduto = this.dadosForm.value;
    if (!p.id) {
      this.addProduct(p);
    } else {
      this.updateProduct(p);
    }
  }

  addProduct(p: GrupoProduto) {
    this.grupoProdutoService.addGrupoProduto(p)
      .then(() => {
        this.snackBar.open('GrupoProduto adicionado.', 'OK', { duration: 2000 });
        this.clearFields();
      })
      .catch(() => {
        this.snackBar.open('Error on submiting the product.', 'OK', { duration: 2000 });
      });
  }

  updateProduct(p: GrupoProduto) {
    this.grupoProdutoService.updateGrupoProduto(p)
      .then(() => {
        this.snackBar.open('GrupoProduto atualizado', 'OK', { duration: 2000 });
        this.clearFields();
      })
      .catch((e) => {
        console.log(e);
        this.snackBar.open('Error updating the product', 'OK', { duration: 2000 });
      });

  }

  edit(p: GrupoProduto) {
    this.dadosForm.setValue(p);
  }

  delete(p: GrupoProduto) {
    this.grupoProdutoService.deleteGrupoProduto(p)
      .then(() => {
        this.snackBar.open('Grupo de Produto removido', 'OK', { duration: 2000 });
      })
      .catch((e) => {
        console.log(e);
        this.snackBar.open('Error when trying to remove the product', 'OK', { duration: 2000 });
      });
  }

  clearFields() {

    // this.blnEdicao = false;

    // this.frmPosicaoInicial.nativeElement.focus();

    // this.bebidaForm.reset();
    this.montarFormulario();
    // this.formDirective.resetForm();

  }
}
