import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }

  getAllServices(): Observable<any> {
    return this.http.get(`${environment.stationmanagement_url}/api/Service/Getall`);
 }

 getServiceById(id: string): Observable<any> {
    return this.http.get(`${environment.stationmanagement_url}/api/Service/getbyid/${id}`);
 }

 addService(service: any): Observable<any> {
    return this.http.post(`${environment.stationmanagement_url}/api/Service/addService`, service);
 }

 updateService(id: string, service: any): Observable<any> {
    return this.http.put(`${environment.stationmanagement_url}/api/Service/putService/${id}`, service);
 }

 deleteService(id: string): Observable<any> {
    return this.http.delete(`${environment.stationmanagement_url}/api/Service/deleteService/${id}`);
 }
}
