import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';
import { NFCEs } from '../interfaces/nfces';
import { NfceService } from '../servicos/nfce.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-upload-arquivos',
  templateUrl: './upload-arquivos.component.html',
  styleUrls: ['./upload-arquivos.component.css']
})
export class UploadArquivosComponent implements OnInit {

  constructor(
    private afStorage: AngularFireStorage,
    private http: HttpClient,
    private nfceService: NfceService
  ) { }

  @ViewChild('xmlFiles', { static: false }) xmlFiles: any;
  @ViewChild('nf', { static: false }) nf: any;
  @ViewChild('dataInicio', { static: false }) dataInicio: string;
  @ViewChild('dataFim', { static: false }) dataFim: string;


  refArquivo: AngularFireStorageReference;
  task: AngularFireUploadTask;

  private nfceTmp: NFCEs;
  private nfceLida: any;


  ngOnInit() {
  }
  async uploadArquivos($event) {

    this.dataInicio = Date();

    const input = $event.target;
    // const nomePasta = '/NFCe/2020_01_Teste/';

    let i = 0;
    for (const iterator of input.files) {

      // console.log(iterator.name);
      // const nomeArquivo = iterator.name;

      // FIXME: Bug do milênio. rsss
      const nomeArquivo = '/NFCe/20'
        .concat(iterator.name.substring(2, 4))
        .concat('_')
        .concat(iterator.name.substring(4, 6))
        .concat('/')
        .concat(iterator.name);

      // console.log(nomeArquivo);

      // this.afStorage.upload(nomeArquivo, iterator);
      await this.upload(nomeArquivo, iterator);

      i += 1;
      console.log(i);
    }

    this.dataFim = Date();

    console.log(this.dataInicio);
    // console.log(this.dataFim);

    // alert('Envio ...');

    // TODO: Melhorar esta rotina utilizando os conceitos do abaixo:
    // fonte: https://firebase.google.com/docs/storage/web/upload-files?hl=pt-br
    //        https://fireship.io/lessons/angular-firebase-storage-uploads-multi/
    // Para controlar o upLoad

    // const ref = this.afStorage.ref(randomId);
    // this.task = this.ref.put(event.target.files[0]);
    // this.uploadProgress = this.task.percentageChanges();
    // this.downloadURL = this.task.downloadURL();
  }


  async upload(nomeArquivo: any, refArquivo) {

    this.refArquivo = this.afStorage.ref(nomeArquivo);
    // console.log(refArquivo);
    this.task = this.refArquivo.put(refArquivo);


    this.task.then(up => {
      console.log('....');
      // map(up);
      this.refArquivo.getDownloadURL()
        .subscribe(
          success => {
            // console.log(up);
            // console.log(up.metadata.fullPath);
            // console.log(up.state);
            this.getUrl(up.metadata.fullPath);
          },
          error => { console.log(error); }
        );

    });
  }

  getUrl(nomeArquivo: string) {

    const refArquivo = firebase.storage().ref(nomeArquivo);

    // Get the download URL
    refArquivo.getDownloadURL()
      .then((url) => {

        console.log(url);
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
              qtdeComprada: parseInt(iterator.PROD[0].QCOM[0], 10),
              valorUnitario: parseFloat(iterator.PROD[0].VUNCOM[0])
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

  gravarLinha(p, id) {

    this.nfceService.addDadosNFCE(p, id)
      .then(() => {
        console.log(Date());

      })
      .catch((err) => {
        // const notifyTmp: string = 'Erro ao adicionar a Pedido.' + formatDate(p.dataPedido, 'shortDate', 'pt-br');
        // this.notify(notifyTmp);
        console.log(err);
      });
  }

}
