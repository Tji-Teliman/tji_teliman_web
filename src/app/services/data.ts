import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Data {

  header = new HttpHeaders();
  authToken = localStorage.getItem('token');

  constructor(private http:HttpClient) {
    this.header = new HttpHeaders();
    this.header.append('Content-Type', 'application/json');
    this.header.append('Accept', 'application/json');
    this.header.append('Access-Control-Allow-Origin', '*');
    this.header.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    this.header.append('Authorization',`Bearer ${this.authToken}`);
  }

  getData(url: string) {
    const authToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.get(url, { headers: headers });
  }

  getDataById(url: string, id: number) {
    return this.http.get(`${url}${id}`, { headers: this.header });
  }

  postData(url: string, body: any) {
    const authToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.post(url, body, { headers: headers });
  }


  postDataWithFile(url: string, body: any,file?:File,nomAttribut?:string) {
    const formData = new FormData();
    if (nomAttribut) {
      formData.append(nomAttribut, new Blob([JSON.stringify(body)], {
        type: 'application/json'
      }));
    }else{
      formData.append('contenu', new Blob([JSON.stringify(body)], {
        type: 'application/json'
      }));
    }
    if (file) {
      formData.append('fichier', file);
    }
    return this.http.post(`${url}`, formData);
  }

  post(url:string){
    return this.http.post(`${url}`,null,{ headers: this.header });
  }

  put(url:string){
    return this.http.put(`${url}`, { headers: this.header });
  }

  putData(url: string, id?: number, body?: any,attribut?:any) {
    const formData = new FormData();
    formData.append(attribut, new Blob([JSON.stringify(body)], {
      type: 'application/json'
    }));
    return this.http.put(`${url}${id}`, formData, { headers: this.header });
  }

  putDataNotId(url: string, body?: any,attribut?:any) {
    const formData = new FormData();
    formData.append(attribut, new Blob([JSON.stringify(body)], {
      type: 'application/json'
    }));
    return this.http.put(`${url}`, formData, { headers: this.header });
  }

  putDataWithFile(url: string, id: number, body: any,file:File) {
    const formData = new FormData();
    formData.append('contenu', new Blob([JSON.stringify(body)], {
      type: 'application/json'
    }));
    if (file) {
      formData.append('fichier', file);
    }
    return this.http.put(`${url}${id}`, formData);
  }

  deleteData(url: string, id: number) {
    return this.http.delete(`${url}${id}`, { headers: this.header });
  }


}
