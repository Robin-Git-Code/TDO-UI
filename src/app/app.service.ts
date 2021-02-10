import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  data:boolean;
  fixedetterValue:boolean;
  dataItem:any;
  constructor(private httpClient: HttpClient) { }
  url = 'http://103.21.53.14:8083/api/';  // QA URL
  // url = 'http://localhost:54436/api/'; // Shubham QA 

  GET(url: string) {
    let token = localStorage.getItem("LoggedInToken");
    return this.httpClient.get(
      this.url + url, {
      observe: 'response',
      // headers: {
      //   'Authorization': 'bearer ' + token,
      //   'Content-Type': 'application/json',
      //   'Accept': 'application/json'
      // }
    });
  }

  POST(url: string, data: object) {
    return this.httpClient.post(
      this.url + url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  PUT(url: string, data: object) {
    return this.httpClient.put(
      this.url + url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  DELETE(url: string) {
    return this.httpClient.delete(
      this.url + url, {
      observe: 'response',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  setDocumentValue(value:boolean){
    this.data = value;
  }

  getDocumentValue(){
    return this.data;
  }

  setFixedLValue(value:boolean){
    this.fixedetterValue = value;
  }

  getFixedLValue(){
    return this.fixedetterValue;
  }

  saveDeletedItem(item:any){
    this.dataItem = item;
  }

  getDeletedItem(){
    return this.dataItem;
  }

}
