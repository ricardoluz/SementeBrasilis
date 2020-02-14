
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { DadosNFCE } from '../interfaces/nfceDados';

@Injectable({
  providedIn: 'root'
})
export class NfceService {

  private nfceVendaCollection: AngularFirestoreCollection<DadosNFCE> = this.afs.collection('nfceVenda');

  constructor(
    private afs: AngularFirestore
  ) { }

  addDadosNFCE(p: DadosNFCE, id: string) {
    // p.id = this.afs.createId();
   return this.nfceVendaCollection.doc(id).set(p);
  //  return this.nfceVendaCollection.add(p);
  }

}
