
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
import * as xml2js from 'xml2js';
import { NFCEs } from '../interfaces/nfces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HtmlParser } from '@angular/compiler';

@Component({
  selector: 'app-download-arquivos',
  templateUrl: './download-arquivos.component.html',
  styleUrls: ['./download-arquivos.component.css']
})
export class DownloadArquivosComponent implements OnInit {

  constructor(
    private afStorage: AngularFireStorage,
    private http: HttpClient
  ) { }

  private nfceTmp: NFCEs;
  listaNFCe: NFCEs[] = [];

  @ViewChild('csvReader', { static: false }) csvReader: any;
  @ViewChild('nf', { static: false }) nf: any;


  ngOnInit() {
    this.downloadArquivos();
  }


  uploadListener($event: any): void {

    const files = $event.srcElement.files;

    const input = $event.target;

    let i = 0;
    for (const iterator of input.files) {
      this.loadXML_Local(iterator.name);
      i += 1;
    }
    console.log(i);

    // this.loadXML(input.files[0].name);
    console.log(this.listaNFCe);
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
    // const listRef = storageRef.child('NFCe/2020_01/33200107157694000114650000000736471039594214-procNFe.xml');
    const listRef = storageRef.child('NFCe/');

    listRef.listAll().then((res) => {
      res.prefixes.forEach((folderRef) => {
        console.log(folderRef);

        // All the prefixes under listRef.
        // You may call listAll() recursively on them.
      });
      res.items.forEach((itemRef) => {
        console.log(itemRef);
        console.log(itemRef.location);
        // All the items under listRef.
      });
    }).catch((error) => {
      console.log(error);
    });


    return 0;

    // Get the download URL

    listRef.getDownloadURL()
      .then((url) => {
        // Insert url into an <img> tag to "download"
        console.log('p1');
        console.log(url);
        console.log('p2');

        this.loadXML(url);


      }).catch((error) => {


        console.log(error);
        console.log('p3');

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

    // let fonteHeaders: HttpHeaders = new HttpHeaders();
    // fonteHeaders = fonteHeaders.append('access-control-allow-origin', '*');

    // const options = new RequestOptions({ headers: headers });
    // const options: RequestOptions =  ({ headers : fonteHeaders });


    // headers = headers.append('responseType' : 'text')

    // this.http.get(nomeArquivo,
    // {
    // headers: new HttpHeaders()
    // .set('access-control-allow-origin', '*')
    // .append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD')
    // .append('access-control-allow-credentials', 'true')
    // // .append('access-control-expose-headers', 'Cache-Control, Content-Length, ader-UploadID, X-Google-Trace')

    // // tslint:disable-next-line: max-line-length
    // .append('Access-Control-Allow-Headers', 'access-control-allow-credentials, access-control-allow-origin')

    // tslint:disable-next-line: max-line-length
    // .append('Access-Control-Allow-Headers', 'origin, content-type, accept, authorization, a÷ccess-control-allow-origin, access-control-allow-credentials')

    // .append(https://sementebrasilis-v01.firebaseapp.com)

    // .set('Content-Type', 'text/xml')
    // .append('Access-Control-Allow-Origin', 'https://sementebrasilis.com.br/')
    // .append('Access-Control-Allow-Methods', 'GET')
    // .append('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Accept-Encoding, Authorization, X-Requested-With')
    // tslint:disable-next-line: max-line-length
    // .append('Access-Control-Allow-Headers', 'X - PINGOTHER, Content - Type, X - Requested - With, accept, Origin, Access - Control - Request - Method, Access - Control - Request - Headers, Authorization')

    // tslint:disable-next-line: max-line-length
    // .append('Access-Control-Allow-Headers', 'Origin, Access-Control-Allow-Origin, X-Custom-Header, Accept, Accept-Language, Content-Language, Content-Type')

    //   .append('Access-Control-Allow-Headers', 'Content-Type, text/plain')
    // .append('Access-Control-Allow-Headers', 'Content-Type')
    //  'Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Request-Method')
    //   //  'Access-Control-Allow-Origin, Access-Control-Allow-Headers, Access-Control-Request-Method')

    // headers: new HttpHeaders({ 'Content- Type': 'application / json', 'Access-Control-Allow-Origin': 'http://localhost:4200' })

    // , responseType: 'text'
    // })
    // this.http.get(nomeArquivo, headers);

    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'text/xml',
        // 'access-control-allow-origin': '*',
        // 'Access-Control-Allow-Methods': '*',
        // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
        // 'Access-control-Allow-Credentials': 'true',
        // 'Access-Control-Allow-Headers': '',

        // responseType: 'text'
        // responseType: 'blob'
        // responseType: 'arraybuffer'

      }
      )
    };

    this.http.get(nomeArquivo,  { responseType: 'text' }
    )
      .subscribe((data) => {

        // console.log(data);

        parser.parseString(data, (err, result) => {

          // console.log(err);

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

  // return this.http.get(this.heroesUrl, requestOptions)

  loadXML_Local(nomeArquivo) {

    const parser = new xml2js.Parser({ strict: false, trim: true });
    nomeArquivo = '/assets/' + nomeArquivo;
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
          // console.log(this.nf);

          // console.log(this.nf.NFEPROC.NFE[0].INFNFE);
          // console.log('chave: ', this.nf.NFEPROC.NFE[0].INFNFE[0].$.ID);
          // console.log('emitida: ', this.nf.NFEPROC.NFE[0].INFNFE[0].IDE[0].DHEMI[0]);
          // console.log('série: ', this.nf.NFEPROC.NFE[0].INFNFE[0].IDE[0].SERIE[0]);
          // console.log('NF num: ', this.nf.NFEPROC.NFE[0].INFNFE[0].IDE[0].NNF[0]);

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
