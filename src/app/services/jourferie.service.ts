import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JourferieService {

 
  constructor(private http: HttpClient) { }


  get() {
    return this.http.get(environment.systemsupport_url + '/api/JourFeries' );
  }
}