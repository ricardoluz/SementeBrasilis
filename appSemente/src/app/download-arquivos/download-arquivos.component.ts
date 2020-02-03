import { Component, OnInit, ViewChild } from '@angular/core';
import * as firebase from 'firebase/app';
import * as xml2js from 'xml2js';
import { NFCEs } from '../interfaces/nfces';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-download-arquivos',
  templateUrl: './download-arquivos.component.html',
  styleUrls: ['./download-arquivos.component.css']
})
export class DownloadArquivosComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  private nfceTmp: NFCEs;
  listaNFCe: NFCEs[] = [];

  @ViewChild('csvReader', { static: false }) csvReader: any;
  @ViewChild('nf', { static: false }) nf: any;


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

          this.nf = result;

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

          this.nfceTmp.idNFCE = this.nf.NFEPROC.NFE[0].INFNFE[0].$.ID;
          this.nfceTmp.dataEmissao = this.nf.NFEPROC.NFE[0].INFNFE[0].IDE[0].DHEMI[0];
          this.nfceTmp.serie = this.nf.NFEPROC.NFE[0].INFNFE[0].IDE[0].SERIE[0];
          this.nfceTmp.numeroNF = this.nf.NFEPROC.NFE[0].INFNFE[0].IDE[0].NNF[0];

          let tmpParcial: any = {};
          const tmp: any = [];

          for (const iterator of this.nf.NFEPROC.NFE[0].INFNFE[0].DET) {
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

        this.listaNFCe.push(this.nfceTmp);

      });
  }
}
