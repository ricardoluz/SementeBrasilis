import { NfceService } from './../servicos/nfce.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase/app';
import * as xml2js from 'xml2js';

import { NFCEs } from '../interfaces/nfces';
import { DadosNFCE } from '../interfaces/nfceDados';

@Component({
  selector: 'app-download-arquivos',
  templateUrl: './download-arquivos.component.html',
  styleUrls: ['./download-arquivos.component.css']
})
export class DownloadArquivosComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private nfceService: NfceService
  ) { }

  private nfceTmp: NFCEs;
  private dadosNFCE: DadosNFCE;

  listaNFCe: NFCEs[] = [];
  listaDadosNFCe: DadosNFCE[] = [];

  @ViewChild('csvReader', { static: false }) csvReader: any;
  @ViewChild('nf', { static: false }) nfceLida: any;


  ngOnInit() {
    this.downloadArquivos();
  }

  downloadArquivos() {

    const storageRef = firebase.storage().ref();

    // Create a reference under which you want to list
    const listRef = storageRef.child('NFCe/2020_01_Teste');

    listRef.listAll().then((res) => {

      console.log(res.items.length);

      res.prefixes.forEach((folderRef) => {

        console.log(folderRef.fullPath);

        // All the prefixes under listRef.
        // You may call listAll() recursively on them.

      });

      res.items.forEach((itemRef) => {
        // All the items under listRef.
        // console.log(itemRef.fullPath);
        // console.log(itemRef.name);

        this.getUrl(itemRef);

      });
    }).catch((error) => {
      console.log(error);
    });
  }

  getUrl(listRef: firebase.storage.Reference) {

    // Get the download URL
    listRef.getDownloadURL()
      .then((url) => {

        this.loadXML(url);
        // this.loadXML_v02(url);

      }).catch((error) => {

        console.log(error);

        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/object-not-found':
            // File doesn't exist
            break;

          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;

          case 'storage/canceled':
            // User canceled the upload
            break;
          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            break;
        }
      });
  }

  loadXML(nomeArquivo) {

    const parser = new xml2js.Parser({ strict: false, trim: true });

    this.http.get(nomeArquivo, { responseType: 'text' }
    )
      .subscribe((data) => {

        parser.parseString(data, (err, result) => {

          this.nfceLida = result;

          this.nfceTmp = {
            idNFCE: '',
            dataEmissao: '',
            serie: 0,
            numeroNF: 0,
            produtos: {
              codProduto: '',
              descricaoProduto: '',
              qtdeComprada: 0,
              valorUnitario: 0
            }
          };

          this.nfceTmp.idNFCE = this.nfceLida.NFEPROC.NFE[0].INFNFE[0].$.ID;
          this.nfceTmp.dataEmissao = this.nfceLida.NFEPROC.NFE[0].INFNFE[0].IDE[0].DHEMI[0];
          this.nfceTmp.serie = this.nfceLida.NFEPROC.NFE[0].INFNFE[0].IDE[0].SERIE[0];
          this.nfceTmp.numeroNF = this.nfceLida.NFEPROC.NFE[0].INFNFE[0].IDE[0].NNF[0];

          let tmpParcial: any = {};
          const tmp: any = [];

          for (const iterator of this.nfceLida.NFEPROC.NFE[0].INFNFE[0].DET) {
            tmpParcial = {
              codProduto: iterator.PROD[0].CPROD[0],
              descricaoProduto: iterator.PROD[0].XPROD[0],
              qtdeComprada: iterator.PROD[0].QCOM[0],
              valorUnitario: iterator.PROD[0].VUNCOM[0]
            };
            tmp.push(tmpParcial);

          }
          // console.log(tmp);
          this.nfceTmp.produtos = tmp;
        }
        );

        // this.listaNFCe.push(this.nfceTmp);
        this.gravarLinha(this.nfceTmp, this.nfceTmp.idNFCE);

      });
  }

  loadXML_v02(nomeArquivo) {

    const parser = new xml2js.Parser({ strict: false, trim: true });

    this.http.get(nomeArquivo, { responseType: 'text' }
    )
      .subscribe((data) => {

        parser.parseString(data, (err, result) => {

          this.nfceLida = result;

          this.listaDadosNFCe = [];


          for (const iterator of this.nfceLida.NFEPROC.NFE[0].INFNFE[0].DET) {

            this.dadosNFCE = {
              idNFCE: '',
              dataEmissao: '',
              codProduto: '',
              descricaoProduto: '',
              qtdeComprada: 0,
              valorUnitario: 0
            };

            this.dadosNFCE.idNFCE = this.nfceLida.NFEPROC.NFE[0].INFNFE[0].$.ID;
            this.dadosNFCE.dataEmissao = this.nfceLida.NFEPROC.NFE[0].INFNFE[0].IDE[0].DHEMI[0];

            this.dadosNFCE.codProduto = iterator.PROD[0].CPROD[0];
            this.dadosNFCE.descricaoProduto = iterator.PROD[0].XPROD[0];
            this.dadosNFCE.qtdeComprada = parseFloat(iterator.PROD[0].QCOM[0]);
            this.dadosNFCE.valorUnitario = parseFloat(iterator.PROD[0].VUNCOM[0]);

            // this.listaDadosNFCe.push(this.dadosNFCE);
            console.log(this.dadosNFCE);

            // this.gravarLinha(this.dadosNFCE);

          }
        }
        );

      });
  }

  gravarLinha(p, id) {

    this.nfceService.addDadosNFCE(p, id)
      .then(() => {

      })
      .catch((err) => {
        // const notifyTmp: string = 'Erro ao adicionar a Pedido.' + formatDate(p.dataPedido, 'shortDate', 'pt-br');
        // this.notify(notifyTmp);
        console.log(err);
      });
  }
}
