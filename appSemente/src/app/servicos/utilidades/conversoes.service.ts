import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ConversoesService {

  constructor() { }

  objectTimeStampToDate(objeto: any) {

    const objetoTimeStamp = { nanoseconds: 0, seconds: 120 };
    Object.assign(objetoTimeStamp, objeto);
    const timeStamp = objetoTimeStamp.seconds * 1000;

    return new Date(formatDate(timeStamp, 'yyyy/MM/dd hh:mm:ss', 'pt-br'));

   }
}
