import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-upload-arquivos',
  templateUrl: './upload-arquivos.component.html',
  styleUrls: ['./upload-arquivos.component.css']
})
export class UploadArquivosComponent implements OnInit {

  @ViewChild('xmlFiles', { static: false }) xmlFiles: any;
  @ViewChild('nf', { static: false }) nf: any;

  constructor(
    private afStorage: AngularFireStorage,
  ) { }

  ngOnInit() {
  }

  uploadArquivos($event) {

    const input = $event.target;
    // const nomePasta = '/NFCe/2020_01_Teste/';

    let i = 0;
    for (const iterator of input.files) {

      console.log(iterator.name);
      // const nomeArquivo = iterator.name;

      // FIXME: Bug do milênio. rsss
      const nomeArquivo = '/NFCe/20'
        .concat(iterator.name.substring(2, 4))
        .concat('_')
        .concat(iterator.name.substring(4, 6))
        .concat('/')
        .concat(iterator.name);

      // console.log(nomeArquivo);

      this.afStorage.upload(nomeArquivo, iterator);

      i += 1;
    }

    alert('Envio ...');

    // TODO: Melhorar esta rotina utilizando os conceitos do abaixo:
    // fonte: https://firebase.google.com/docs/storage/web/upload-files?hl=pt-br
    //        https://fireship.io/lessons/angular-firebase-storage-uploads-multi/
    // Para controlar o upLoad

    // const ref = this.afStorage.ref(randomId);
    // this.task = this.ref.put(event.target.files[0]);
    // this.uploadProgress = this.task.percentageChanges();
    // this.downloadURL = this.task.downloadURL();
  }




}
