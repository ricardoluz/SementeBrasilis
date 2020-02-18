import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';
import { NFCEs } from '../interfaces/nfces';
import { NfceService } from '../servicos/nfce.service';

@Component({
  selector: 'app-upload-arquivos',
  templateUrl: './upload-arquivos.component.html',
  styleUrls: ['./upload-arquivos.component.css']
})
export class UploadArquivosComponent implements OnInit {

  @ViewChild('xmlFiles', { static: false }) xmlFiles: any;
  @ViewChild('nf', { static: false }) nf: any;

  refArquivo: AngularFireStorageReference;
  task: AngularFireUploadTask;

  private nfceTmp: NFCEs;
  private nfceLida: any;

  constructor(
    private afStorage: AngularFireStorage,
    private http: HttpClient,
    private nfceService: NfceService
  ) { }

  ngOnInit() {
  }

  async uploadArquivos($event) {

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
    }

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



    // tslint:disable-next-line: deprecation
    // console.log((await this.task).downloadURL);
    // console.log(this.task.snapshotChanges());

    // this.afStorage.upload(nomeArquivo, refArquivo).then(
    //   teste => {
    //     console.log(teste);
    //     const arq = this.afStorage.ref(nomeArquivo);
    //     console.log(arq);
    //   }

    // );


    this.task.then(up => {
      // tslint:disable-next-line: deprecation
      // console.log(up);
      // console.log(up.metadata);

      console.log('....');
      // map(up);
      this.refArquivo.getDownloadURL()
        .pipe(
          map(arq => {
            // console.log(up.metadata);
            // console.log(arq);
            // console.log('....');
          })

        )
        .subscribe(
          success => {
            // console.log(up);

            console.log(up.metadata.fullPath);
            // console.log('ok');
            // console.log(success);
            // this.loadXML(success);
          },
          error => { console.log(error); }
        );

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
