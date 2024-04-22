import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramFidaliteService {

  constructor(private http: HttpClient) { }

  applyRemise(amount: any): Observable<any> {
   return this.http.get(`${environment.api_url}/api/Remise/applyRemise/${amount}`);
}
  calcPointBonus(model: any): Observable<any> {
   return this.http.post(`${environment.api_url}/api/Fidalite/calcPointBonus`, model);
}

generateBonachat(numCarte: string): Observable<any> {
   return this.http.get(`${environment.api_url}/api/Fidalite/GenerateBonachat/${numCarte}`);
}

  getAllRemises(): Observable<any> {
    return this.http.get(`${environment.api_url}/api/Remise/Getall`);
 }

 getRemiseById(id: number): Observable<any> {
    return this.http.get(`${environment.api_url}/api/Remise/getbyid/${id}`);
 }

 addRemise(remise: any): Observable<any> {
    return this.http.post(`${environment.api_url}/api/Remise/addRemise`, remise);
 }

 updateRemise(id: number, remise: any): Observable<any> {
    return this.http.put(`${environment.api_url}/api/Remise/putremise/${id}`, remise);
 }

 deleteRemise(id: number): Observable<any> {
    return this.http.delete(`${environment.api_url}/api/Remise/delete/${id}`);
 }
}
