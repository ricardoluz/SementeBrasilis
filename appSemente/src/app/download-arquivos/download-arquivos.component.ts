
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
import * as xml2js from 'xml2js';
import { NFCEs } from '../interfaces/nfces';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-download-arquivos',
  templateUrl: './download-arquivos.component.html',
  styleUrls: ['./download-arquivos.component.css']
})
export class DownloadArquivosComponent implements OnInit {

  private nfceTmp: NFCEs;
  private listaNFCe: NFCEs[] = [];

  @ViewChild('nf', { static: false }) nf: any;
  // private nf: any;
  meta: any;


  constructor(
    private afStorage: AngularFireStorage,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.downloadArquivos();
  }


  downloadArquivos() {

    const firebaseConfig = {
      apiKey: 'AIzaSyC0HceU8atIBs31f5QmF49he113OqPj2h0',
      authDomain: 'sementebrasilis-v01.firebaseapp.com',
      databaseURL: 'https://sementebrasilis-v01.firebaseio.com',
      storageBucket: 'sementebrasilis-v01.appspot.com',
    };

    // firebase.initializeApp(firebaseConfig);


    const storageRef = firebase.storage().ref();

    // Create a reference under which you want to list
    const listRef = storageRef.child('NFCe/2020_01/33200107157694000114650000000736471039594214-procNFe.xml');

    // Find all the prefixes and items.
    // listRef.listAll().then((res) => {
    //   res.prefixes.forEach((folderRef) => {
    //     console.log(folderRef);

    //     // All the prefixes under listRef.
    //     // You may call listAll() recursively on them.
    //   });
    //   res.items.forEach((itemRef) => {
    //     console.log(itemRef);
    //     // All the items under listRef.
    //   });
    // }).catch((error) => {
    //   console.log(error);
    // });


    // Get the download URL

    listRef.getDownloadURL()
      .then((url) => {
        // Insert url into an <img> tag to "download"
        console.log('p1');
        console.log(url);

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


    // const query = {
    //   delimiter: 'NFCe/'
    // };
    // const storageRefX = firebase.storage().  .bucket().getFiles(query, function (err, files, nextQuery, apiResponse) {

    //   console.log(files);
    // }

    // const ref = this.afStorage.ref('NFCe/2020_01/33200107157694000114650000000736471039594214-procNFe.xml');
    // this.meta = ref.getMetadata();
    // console.log(ref);

  }

  loadXML(nomeArquivo) {

    const parser = new xml2js.Parser({ strict: false, trim: true });
    // nomeArquivo = '/assets/' + nomeArquivo;
    // console.log(nomeArquivo);

    this.http.get(nomeArquivo,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'text/xml')
          .append('Access-Control-Allow-Methods', 'GET')
          .append('Access-Control-Allow-Origin', '*')
          .append('Access-Control-Allow-Headers',
            'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method'),
        responseType: 'text'
      })
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
