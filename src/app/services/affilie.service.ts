import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AffilieService {

constructor(private http: HttpClient) { }
  
List() {
  return this.http.get(environment.stationmanagement_url + '/api/Affilies');
}
ListAll() {
  return this.http.get(environment.stationmanagement_url + '/api/Affilies/AllData');
}

add(model:any) {
  return this.http.post(environment.stationmanagement_url + '/api/Affilies',model);
}

getAll() {
  return this.http.get(environment.stationmanagement_url + '/api/Get/Affilie');
}

getAffil(id){
  return this.http.get(environment.stationmanagement_url + '/api/Get/Affilie/'+`${id}`)
}
update(id,model){
  return this.http.put(environment.stationmanagement_url + '/api/Update/Affilie/'+ `${id}`, model);
}

addService(model:any) {
  
  return this.http.post(environment.stationmanagement_url + '/api/Add/Service/Affilie',model)
  
}

Activate(id){
  return this.http.put(environment.stationmanagement_url + '/api/Affilies/ActivateOrDesacitvate/'+ `${id}`,null);
}
}